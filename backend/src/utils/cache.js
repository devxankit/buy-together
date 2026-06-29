/**
 * Two-tier cache: L1 in-process memory + L2 Redis (optional).
 * -----------------------------------------------------------
 * For small, frequently-read, slowly-changing data (active categories, home
 * sections, content pages, banners, admin dashboard aggregates).
 *
 *   L1 (memory) — sub-millisecond, per-process. Always present.
 *   L2 (Redis)  — shared across processes/instances, survives restarts.
 *                 Used only when Redis is configured AND currently connected;
 *                 otherwise everything transparently runs on L1 alone, exactly
 *                 like the old memory-only cache.
 *
 * Read path (`wrap`):  L1 → L2 → loader().  A value loaded from the DB is written
 * to both tiers; a value found in L2 is promoted into L1.
 *
 * Invalidation: writers call `del(key)` (or `clear()`). That removes the key
 * from the local L1 + from Redis, and publishes the key on a Redis channel so
 * every OTHER instance busts its own L1 too — keeping all processes coherent
 * without waiting for a TTL to expire. With no Redis it's a plain local delete.
 *
 * The public API (get/set/del/clear/wrap) is unchanged from the memory-only
 * version, so existing call sites need no edits. `del`/`clear` return promises
 * but callers may safely fire-and-forget them (as they already do).
 */
const config = require('../config/env');
const logger = require('./logger');
const redis = require('../config/redis');

const store = new Map(); // key -> { value, expiresAt }   (L1)
const inflight = new Map(); // key -> Promise              (miss coalescing)

const CLEAR_ALL = '*'; // invalidation payload meaning "flush everything"

// ---- L1 (memory) primitives -------------------------------------------------

const memGet = (key) => {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
};

const memSet = (key, value, ttlMs) => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

const memDel = (key) => {
  store.delete(key);
  inflight.delete(key);
};

// ---- L2 (Redis) helpers — all best-effort, never throw ----------------------

const redisActive = () => redis.isReady() && redis.getClient();

const redisGet = async (key) => {
  const client = redisActive();
  if (!client) return undefined;
  try {
    const raw = await client.get(key);
    if (raw === null || raw === undefined) return undefined;
    return JSON.parse(raw);
  } catch (err) {
    logger.warn(`cache L2 get failed for "${key}": ${err.message}`);
    return undefined;
  }
};

const redisSet = async (key, value, ttlMs) => {
  const client = redisActive();
  if (!client) return;
  try {
    // PX = expiry in milliseconds, matching the L1 TTL exactly.
    await client.set(key, JSON.stringify(value), 'PX', ttlMs);
  } catch (err) {
    logger.warn(`cache L2 set failed for "${key}": ${err.message}`);
  }
};

const redisDel = async (key) => {
  const client = redisActive();
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    logger.warn(`cache L2 del failed for "${key}": ${err.message}`);
  }
};

// Publish an invalidation so peer instances bust their L1. Reuses the command
// client (publish is a normal command, allowed on a non-subscriber connection).
const publishInvalidation = async (payload) => {
  const client = redisActive();
  if (!client) return;
  try {
    await client.publish(redis.INVALIDATION_CHANNEL, payload);
  } catch (err) {
    logger.warn(`cache invalidation publish failed: ${err.message}`);
  }
};

// Best-effort delete of every namespaced key in Redis (for clear()). Uses a
// non-blocking SCAN so it never stalls the server even with many keys.
const redisFlushNamespace = async () => {
  const client = redisActive();
  if (!client) return;
  const match = `${config.redis.keyPrefix}*`;
  try {
    // scanStream yields keys WITH the prefix; client.del re-applies keyPrefix,
    // so strip it before deleting to avoid a doubled prefix.
    const prefixLen = config.redis.keyPrefix.length;
    const stream = client.scanStream({ match, count: 200 });
    // eslint-disable-next-line no-restricted-syntax
    for await (const keys of stream) {
      if (keys.length) {
        await client.del(...keys.map((k) => k.slice(prefixLen)));
      }
    }
  } catch (err) {
    logger.warn(`cache L2 flush failed: ${err.message}`);
  }
};

// ---- Public API -------------------------------------------------------------

/** Synchronous L1 read (memory only). Kept for API compatibility. */
const get = (key) => memGet(key);

/** Write to L1 and (best-effort) L2. Returns the value synchronously. */
const set = (key, value, ttlMs) => {
  memSet(key, value, ttlMs);
  redisSet(key, value, ttlMs); // fire-and-forget
  return value;
};

/**
 * Invalidate a key everywhere: local L1, Redis, and peer instances' L1.
 * Callers may ignore the returned promise.
 */
const del = async (key) => {
  memDel(key);
  await Promise.all([redisDel(key), publishInvalidation(key)]);
};

/** Flush the whole cache (L1 + Redis namespace + peers). */
const clear = async () => {
  store.clear();
  inflight.clear();
  await Promise.all([redisFlushNamespace(), publishInvalidation(CLEAR_ALL)]);
};

/**
 * Return the cached value if fresh, else run `loader()`, cache its result in
 * both tiers, and return it. Concurrent in-process misses for the same key
 * share a single loader/Redis call.
 */
const wrap = async (key, ttlMs, loader) => {
  const local = memGet(key);
  if (local !== undefined) return local;

  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    try {
      // Try the shared L2 before hitting the DB.
      const fromRedis = await redisGet(key);
      if (fromRedis !== undefined) {
        memSet(key, fromRedis, ttlMs); // promote into L1
        return fromRedis;
      }

      const value = await loader();
      // Don't cache `undefined` (our "miss" sentinel); `null` is cacheable.
      if (value !== undefined) {
        memSet(key, value, ttlMs);
        await redisSet(key, value, ttlMs);
      }
      return value;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
};

/**
 * Subscribe to peer invalidation messages so this process busts its L1 when
 * another instance mutates data. Call once after Redis has connected. No-op
 * when Redis is disabled.
 */
const subscribeInvalidations = () => {
  const subscriber = redis.getSubscriber();
  if (!subscriber) return;

  // The subscriber connection has an offline queue, so this is safe to call
  // before it's ready — the SUBSCRIBE is buffered and applied on connect, and
  // ioredis re-subscribes automatically after any reconnect.
  subscriber.subscribe(redis.INVALIDATION_CHANNEL, (err) => {
    if (err) {
      logger.error(`cache: failed to subscribe to invalidation channel: ${err.message}`);
      return;
    }
    logger.info('cache: subscribed to cross-instance invalidation channel');
  });

  subscriber.on('message', (channel, payload) => {
    if (channel !== redis.INVALIDATION_CHANNEL) return;
    // Only touch L1 here — Redis is already updated by the publisher, and we
    // must NOT re-publish or we'd create an invalidation loop.
    if (payload === CLEAR_ALL) {
      store.clear();
      inflight.clear();
    } else {
      memDel(payload);
    }
  });
};

module.exports = { get, set, del, clear, wrap, subscribeInvalidations };
