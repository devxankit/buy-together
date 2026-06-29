/**
 * Cached auth-principal lookup.
 * -----------------------------
 * The `auth` middleware loads the user (or admin) for the Bearer token on EVERY
 * authenticated request — by far the highest-frequency query in the app. We
 * cache the document by id for a short TTL so repeat requests from the same
 * logged-in user skip the DB round trip.
 *
 * Why `.lean()` + `Model.hydrate()` rather than caching the Mongoose doc:
 *   - `.lean()` gives a plain object that serialises cleanly into Redis.
 *   - `hydrate()` rebuilds a real Mongoose document from that object WITHOUT a
 *     DB hit, so `req.user.id` (virtual), `req.user._id` (ObjectId) and any
 *     instance methods keep working exactly as before. Controllers rely on
 *     `req.user.id`, so handing back a bare plain object would break them.
 *
 * Freshness: TTL is short (60s) and every mutation that matters for auth —
 * profile edit, suspend/activate, delete — calls `bustUser`/`bustAdmin`, so a
 * suspended or deleted account stops being served immediately, not after the TTL.
 */
const cache = require('./cache');
const User = require('../models/User');
const Admin = require('../models/Admin');

const TTL_MS = 60 * 1000;
const userKey = (id) => `auth:user:${id}`;
const adminKey = (id) => `auth:admin:${id}`;

const getUser = async (id) => {
  const raw = await cache.wrap(userKey(id), TTL_MS, async () => {
    const doc = await User.findById(id).lean();
    return doc || undefined; // returning undefined keeps "not found" out of the cache
  });
  return raw ? User.hydrate(raw) : null;
};

const getAdmin = async (id) => {
  const raw = await cache.wrap(adminKey(id), TTL_MS, async () => {
    const doc = await Admin.findById(id).lean();
    return doc || undefined;
  });
  return raw ? Admin.hydrate(raw) : null;
};

// Fire-and-forget invalidation (callers don't need to await).
const bustUser = (id) => cache.del(userKey(id));
const bustAdmin = (id) => cache.del(adminKey(id));

module.exports = { getUser, getAdmin, bustUser, bustAdmin };
