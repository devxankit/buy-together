/**
 * Tiny in-process TTL cache.
 * --------------------------
 * For small, frequently-read, slowly-changing data (active categories, home
 * sections, content pages, admin dashboard aggregates). Values live in memory
 * for `ttlMs` then expire lazily on the next read. This is intentionally simple
 * — single-process only (no Redis). Writers that change the underlying data call
 * `del(key)` (or `clear()`) to bust the relevant entry immediately, so reads are
 * never stale beyond an explicit mutation or the TTL window.
 *
 * `wrap(key, ttlMs, loader)` is the main entry point: returns the cached value
 * if fresh, otherwise runs `loader()`, caches its result, and returns it.
 * Concurrent callers for the same missing key share a single in-flight promise
 * (so a burst of requests triggers one DB hit, not N).
 */
const store = new Map(); // key -> { value, expiresAt }
const inflight = new Map(); // key -> Promise

const get = (key) => {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (hit.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
};

const set = (key, value, ttlMs) => {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

const del = (key) => {
  store.delete(key);
  inflight.delete(key);
};

const clear = () => {
  store.clear();
  inflight.clear();
};

const wrap = async (key, ttlMs, loader) => {
  const cached = get(key);
  if (cached !== undefined) return cached;

  // Coalesce concurrent misses into one loader call.
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    try {
      const value = await loader();
      set(key, value, ttlMs);
      return value;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
};

module.exports = { get, set, del, clear, wrap };
