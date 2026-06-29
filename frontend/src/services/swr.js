/**
 * Stale-while-revalidate cache for slow-changing public data (categories,
 * banners, home sections, public settings).
 *
 * Goal: "lightning" repeat visits. On the FIRST paint we hand back whatever copy
 * we already have (in-memory → localStorage) synchronously, so the UI renders
 * with real data instead of empty/fallback state. We then revalidate against the
 * network in the background and call `onData` again only if the fresh result
 * actually differs — so there's no flicker when nothing changed.
 *
 * - In-memory `memCache` makes same-session reads instant and skips the network
 *   entirely while a copy is still fresh (within `ttl`).
 * - localStorage persists across reloads so the very first paint after a refresh
 *   is also instant.
 * - On a network error we keep serving the cached copy instead of breaking.
 */
const memCache = new Map(); // key -> value  AND  `${key}::t` -> fetchedAt

const readPersisted = (key) => {
  try {
    const raw = localStorage.getItem(`swr:${key}`);
    if (!raw) return undefined;
    return JSON.parse(raw).data;
  } catch {
    return undefined; // corrupt/unavailable storage — treat as a miss
  }
};

const DEFAULT_TTL = 5 * 60 * 1000; // 5 min: how long the in-memory copy is "fresh"

/**
 * Synchronously return the cached value for a key (memory → localStorage), or
 * undefined if there's no cache. Lets a component initialise state from cache on
 * the very first render so it never flashes a loading spinner on repeat visits.
 */
export const swrPeek = (key) => {
  let cached = memCache.get(key);
  if (cached === undefined) {
    cached = readPersisted(key);
    if (cached !== undefined) memCache.set(key, cached);
  }
  return cached;
};

/**
 * @param {string} key       Stable cache key (also the localStorage slot).
 * @param {() => Promise<any>} fetcher  Returns the FINAL shape to cache + emit.
 * @param {object} opts
 * @param {(data:any) => void} opts.onData  Called with cached data immediately
 *        (if any) and again with fresh data when it differs.
 * @param {number} [opts.ttl]  Skip the network if the in-memory copy is younger.
 * @returns {Promise<any>} resolves to the freshest value (or cached on error).
 */
export const swr = (key, fetcher, { onData, ttl = DEFAULT_TTL } = {}) => {
  // 1) Instant paint from cache (memory first, then localStorage).
  let cached = memCache.get(key);
  if (cached === undefined) {
    cached = readPersisted(key);
    if (cached !== undefined) memCache.set(key, cached);
  }
  if (cached !== undefined && onData) onData(cached);

  // 2) Skip the network if the in-memory copy is still fresh.
  const fetchedAt = memCache.get(`${key}::t`) || 0;
  if (cached !== undefined && Date.now() - fetchedAt < ttl) {
    return Promise.resolve(cached);
  }

  // 3) Revalidate in the background.
  return Promise.resolve()
    .then(fetcher)
    .then((fresh) => {
      memCache.set(key, fresh);
      memCache.set(`${key}::t`, Date.now());
      try {
        localStorage.setItem(`swr:${key}`, JSON.stringify({ data: fresh, at: Date.now() }));
      } catch {
        /* storage full/blocked — in-memory cache still works */
      }
      // Only re-render when the data actually changed (avoids needless flicker).
      if (onData && JSON.stringify(fresh) !== JSON.stringify(cached)) onData(fresh);
      return fresh;
    })
    .catch((err) => {
      if (cached !== undefined) return cached; // keep serving stale on failure
      throw err;
    });
};

export default swr;
