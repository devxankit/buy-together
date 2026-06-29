/**
 * Redis connection manager (optional L2 cache).
 * ---------------------------------------------
 * Redis is a performance add-on, NOT a hard dependency. If REDIS_URL is unset,
 * or Redis is unreachable, the app keeps working using the in-process memory
 * cache only (see ../utils/cache.js). Nothing here ever throws to the caller or
 * exits the process — that's the whole point: a flaky cache must never take the
 * API down.
 *
 * Two connections are created when enabled:
 *   - `client`     : normal commands (get/set/del) used by the cache.
 *   - `subscriber` : a duplicate connection in subscribe mode, used to receive
 *                    cross-instance cache-invalidation messages. A single Redis
 *                    connection can't run regular commands while subscribed, so
 *                    the publish side reuses `client` and the receive side uses
 *                    this dedicated `subscriber`.
 */
const Redis = require('ioredis');
const config = require('./env');
const logger = require('../utils/logger');

// Channel that invalidation events are published on (busts L1 across instances).
const INVALIDATION_CHANNEL = `${config.redis.keyPrefix}cache:invalidate`;

let client = null;
let subscriber = null;
let ready = false;

const isReady = () => ready;
const getClient = () => client;
const getSubscriber = () => subscriber;

/**
 * Shared options. `lazyConnect: false` means ioredis connects in the background
 * and queues commands until ready; we additionally gate reads on `isReady()` so
 * we never block a request waiting on a cold/broken connection. The retry
 * strategy backs off and gives up after a few attempts so a permanently-missing
 * Redis doesn't spam logs forever — we just stay in memory-only mode.
 */
const buildOptions = () => ({
  keyPrefix: config.redis.keyPrefix,
  // Cap retries per command so a request never hangs on Redis.
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: 5000,
  retryStrategy: (times) => {
    if (times > 10) {
      // Stop hammering a Redis that clearly isn't coming back.
      logger.warn('Redis: giving up reconnection attempts — staying in memory-only cache mode');
      return null;
    }
    return Math.min(times * 200, 3000);
  },
});

/**
 * Connect to Redis if configured. Safe to call once at startup. Returns a
 * resolved promise regardless of outcome (never rejects).
 */
const connectRedis = async () => {
  if (!config.redis.enabled) {
    logger.info('Redis disabled (no REDIS_URL) — using in-process memory cache only');
    return;
  }

  try {
    client = new Redis(config.redis.url, buildOptions());
    // The subscriber only ever runs SUBSCRIBE, so let it use an offline queue:
    // a subscribe() issued before the connection is ready is then buffered and
    // applied on connect (and ioredis auto-resubscribes after reconnects), so we
    // never miss the subscription to a race with the 'ready' event.
    subscriber = client.duplicate({ enableOfflineQueue: true, maxRetriesPerRequest: null });

    client.on('connect', () => logger.info('Redis connection established'));
    client.on('ready', () => {
      ready = true;
      logger.info('Redis ready — L2 cache active');
    });
    client.on('error', (err) => {
      // Demote to memory-only on error; the 'ready' handler re-enables on recovery.
      ready = false;
      logger.error(`Redis error: ${err.message}`);
    });
    client.on('end', () => {
      ready = false;
      logger.warn('Redis connection closed — falling back to memory cache');
    });
    client.on('reconnecting', () => logger.warn('Redis reconnecting…'));

    subscriber.on('error', (err) => logger.error(`Redis subscriber error: ${err.message}`));
  } catch (err) {
    // Construction itself failed (bad URL etc.) — disable cleanly.
    ready = false;
    client = null;
    subscriber = null;
    logger.error(`Redis init failed: ${err.message} — using memory cache only`);
  }
};

/** Gracefully close connections (used on shutdown). */
const disconnectRedis = async () => {
  ready = false;
  // quit() drains pending commands then closes; if Redis is unreachable it
  // can't complete, so fall back to disconnect() which tears down immediately
  // and stops the reconnection loop.
  const close = async (conn) => {
    if (!conn) return;
    try {
      await conn.quit();
    } catch {
      conn.disconnect();
    }
  };
  await Promise.all([close(subscriber), close(client)]);
  subscriber = null;
  client = null;
};

module.exports = {
  connectRedis,
  disconnectRedis,
  isReady,
  getClient,
  getSubscriber,
  INVALIDATION_CHANNEL,
};
