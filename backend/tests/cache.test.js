/*
 * Tests for the two-tier cache (src/utils/cache.js).
 *
 * Part 1 runs in memory-only mode (no REDIS_URL) — the path every install uses
 * when Redis isn't configured.
 * Part 2 swaps ioredis for ioredis-mock to exercise the real L2 (Redis) code
 * paths: write-through, L2-hit-without-loader, del, clear (namespace flush) and
 * cross-instance pub/sub invalidation.
 *
 * Run with:  npm test    (from the backend/ directory)
 */
const assert = require('assert');
const path = require('path');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CACHE_PATH = path.join(__dirname, '..', 'src', 'utils', 'cache');

async function memoryMode() {
  process.env.REDIS_URL = '';
  const cache = require(CACHE_PATH);

  let calls = 0;
  const loader = async () => { calls += 1; return { n: calls }; };

  assert.deepStrictEqual(await cache.wrap('k1', 1000, loader), { n: 1 }, 'first wrap loads');
  assert.deepStrictEqual(await cache.wrap('k1', 1000, loader), { n: 1 }, 'second wrap is cached');
  assert.strictEqual(calls, 1, 'loader runs once for a hit');

  calls = 0;
  const burst = await Promise.all([
    cache.wrap('k2', 1000, loader),
    cache.wrap('k2', 1000, loader),
    cache.wrap('k2', 1000, loader),
  ]);
  assert.strictEqual(calls, 1, 'concurrent misses coalesce');
  assert.deepStrictEqual(burst, [{ n: 1 }, { n: 1 }, { n: 1 }]);

  calls = 0;
  await cache.wrap('k3', 1000, loader);
  await cache.del('k3');
  await cache.wrap('k3', 1000, loader);
  assert.strictEqual(calls, 2, 'del forces a reload');

  calls = 0;
  await cache.wrap('k4', 50, loader);
  await sleep(80);
  await cache.wrap('k4', 50, loader);
  assert.strictEqual(calls, 2, 'expired entry reloads');

  calls = 0;
  await cache.wrap('k5', 1000, async () => { calls += 1; return undefined; });
  await cache.wrap('k5', 1000, async () => { calls += 1; return undefined; });
  assert.strictEqual(calls, 2, 'undefined is never cached');

  calls = 0;
  assert.strictEqual(await cache.wrap('k6', 1000, async () => { calls += 1; return null; }), null);
  assert.strictEqual(await cache.wrap('k6', 1000, async () => { calls += 1; return null; }), null);
  assert.strictEqual(calls, 1, 'null is cached');

  calls = 0;
  await cache.wrap('k7', 1000, loader); // calls=1
  await cache.clear();
  await cache.wrap('k7', 1000, loader); // calls=2 (cache was emptied)
  assert.strictEqual(calls, 2, 'clear empties the cache');

  console.log('✓ memory-mode assertions passed');
}

async function redisMode() {
  // Reset the module registry so cache.js + redis.js are re-required fresh, and
  // substitute ioredis -> ioredis-mock before they load.
  const Module = require('module');
  const RedisMock = require('ioredis-mock');
  const origLoad = Module._load;
  Module._load = function patched(request, parent, isMain) {
    if (request === 'ioredis') return RedisMock;
    return origLoad.call(this, request, parent, isMain);
  };
  // Set env BEFORE re-requiring config/env — dotenv won't override an existing
  // process.env value, so this wins over the empty REDIS_URL in .env.
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.REDIS_KEY_PREFIX = 'bt:';

  // Purge cached env/redis/cache modules so they re-read the new env value.
  Object.keys(require.cache)
    .filter((p) => p.includes(`${path.sep}src${path.sep}`)
      && (p.includes('cache') || p.includes('redis') || p.includes(`config${path.sep}env`)))
    .forEach((p) => delete require.cache[p]);

  const { connectRedis, isReady, getClient, disconnectRedis } = require(path.join(__dirname, '..', 'src', 'config', 'redis'));
  const cache = require(CACHE_PATH);

  await connectRedis();
  cache.subscribeInvalidations(); // attach before 'ready' fires (mirrors server.js)
  for (let i = 0; i < 50 && !isReady(); i += 1) await sleep(10);
  assert.strictEqual(isReady(), true, 'Redis (mock) should be ready');
  await sleep(30);

  // write-through to Redis
  const v = await cache.wrap('l2:k1', 5000, async () => ({ hello: 'world' }));
  assert.deepStrictEqual(v, { hello: 'world' });
  assert.strictEqual(await getClient().get('l2:k1'), JSON.stringify({ hello: 'world' }), 'value written to Redis');

  // L2 hit serves without running the loader
  await getClient().set('l2:k2', JSON.stringify({ from: 'redis' }), 'PX', 5000);
  let loaderRan = false;
  const fromL2 = await cache.wrap('l2:k2', 5000, async () => { loaderRan = true; return { from: 'loader' }; });
  assert.deepStrictEqual(fromL2, { from: 'redis' });
  assert.strictEqual(loaderRan, false, 'L2 hit must not run loader');

  // del clears Redis
  await cache.del('l2:k1');
  assert.strictEqual(await getClient().get('l2:k1'), null, 'del clears Redis key');

  // pub/sub invalidation busts L1
  let calls = 0;
  await cache.wrap('l2:k3', 5000, async () => { calls += 1; return 'x'; });
  await getClient().publish('bt:cache:invalidate', 'l2:k3'); // a peer instance would publish this
  await sleep(40);
  await getClient().del('l2:k3'); // also gone from L2, so a stale L1 would be the only way to skip the loader
  await cache.wrap('l2:k3', 5000, async () => { calls += 1; return 'x'; });
  assert.strictEqual(calls, 2, 'invalidation message busts L1');

  // clear flushes the Redis namespace
  await cache.wrap('l2:k4', 5000, async () => 'y');
  await cache.clear();
  await sleep(30);
  assert.strictEqual(await getClient().get('l2:k4'), null, 'clear flushes Redis namespace');

  // --- auth cache (hydrate) ---
  // Seed L2 directly so getUser() serves from cache and skips the DB loader,
  // then verify it returns a real Mongoose document (so req.user.id works).
  const mongoose = require('mongoose');
  const authCache = require(path.join(__dirname, '..', 'src', 'utils', 'authCache'));
  require(path.join(__dirname, '..', 'src', 'models', 'User')); // ensure model is registered
  const fakeId = new mongoose.Types.ObjectId().toString();
  await getClient().set(
    `auth:user:${fakeId}`,
    JSON.stringify({ _id: fakeId, name: 'Cached User', role: 'buyer', status: 'active' }),
    'PX',
    5000
  );
  const u = await authCache.getUser(fakeId);
  assert.ok(u, 'getUser returns a value from cache');
  assert.strictEqual(u.id, fakeId, 'hydrated doc exposes the .id virtual');
  assert.strictEqual(u.name, 'Cached User', 'hydrated doc carries fields');
  assert.strictEqual(typeof u.save, 'function', 'hydrated doc has Mongoose instance methods');
  await authCache.bustUser(fakeId);
  await sleep(20);
  assert.strictEqual(await getClient().get(`auth:user:${fakeId}`), null, 'bustUser clears the Redis key');
  console.log('  auth-cache hydrate OK → real Mongoose doc with .id virtual, bust works');

  await disconnectRedis();
  Module._load = origLoad;
  console.log('✓ redis-mode (L2) assertions passed');
}

(async () => {
  await memoryMode();
  await redisMode();
  console.log('\nAll cache tests passed.');
  process.exit(0);
})().catch((err) => {
  console.error('\n✗ cache tests failed:', err.stack || err.message);
  process.exit(1);
});
