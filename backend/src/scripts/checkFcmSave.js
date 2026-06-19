/**
 * Verify the FCM token SAVE path end-to-end against the running server.
 *
 *   npm run check:fcm
 *
 * A browser is required to mint a *real* FCM token, but the thing we need to
 * prove is whether the backend persists a token to the user's DB record. So
 * this script authenticates as a real user (signs a JWT exactly like login
 * does) and hits the live HTTP endpoint the browser calls:
 *
 *   POST /v1/fcm/web/register   { token }
 *
 * then re-reads the user from MongoDB to confirm the token landed in
 * `fcmTokens`. It also exercises the service layer directly as a control, so a
 * failure can be localised to route/middleware/validation vs. the DB write.
 *
 * Exit 0 = save path healthy. Non-zero = a real backend problem (printed).
 *
 * NOTE: requires the backend server to be running (npm run dev / npm start).
 */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

const BASE = `http://localhost:${config.port || process.env.PORT || 5000}/v1`;

const run = async () => {
  let failures = 0;

  if (typeof fetch !== 'function') {
    bad('global fetch unavailable — needs Node 18+. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(config.mongoose.url, config.mongoose.options);

  // ── 1. Pick a real buyer to act as ─────────────────────────────────
  head('1. Test user');
  const user = await User.findOne({ role: 'user' }).sort({ createdAt: -1 });
  if (!user) {
    bad('No user with role "user" found in the DB. Create/login one first.');
    await mongoose.disconnect();
    process.exit(1);
  }
  ok(`Acting as: ${user.name} (${user.phone}) · id ${user.id}`);
  const beforeCount = (user.fcmTokens || []).length;
  ok(`Existing web tokens on this user: ${beforeCount}`);

  // A unique, validation-passing fake token (min length 10).
  const httpToken = `TEST_FCM_HTTP_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const svcToken = `TEST_FCM_SVC_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  // ── 2. Real HTTP path: route → auth → validation → controller → DB ──
  head('2. HTTP path  POST /fcm/web/register');
  const jwtToken = jwt.sign(
    { sub: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  let httpSaved = false;
  try {
    const res = await fetch(`${BASE}/fcm/web/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
      body: JSON.stringify({ token: httpToken }),
    });
    const text = await res.text();
    if (res.ok) ok(`HTTP ${res.status} — ${text}`);
    else { bad(`HTTP ${res.status} — ${text}`); failures++; }

    const reread = await User.findById(user.id).select('fcmTokens');
    httpSaved = (reread.fcmTokens || []).includes(httpToken);
    if (httpSaved) ok('Token IS present in DB user.fcmTokens after HTTP call');
    else { bad('Token NOT found in DB after HTTP call'); failures++; }
  } catch (e) {
    bad(`HTTP request failed: ${e.message} (is the server running on ${BASE}?)`);
    failures++;
  }

  // ── 3. Service path control: pushService.saveToken → DB ────────────
  head('3. Service path  pushService.saveToken()');
  try {
    const push = require('../services/push.service');
    await push.saveToken(user.id, svcToken, 'web');
    const reread = await User.findById(user.id).select('fcmTokens');
    const svcSaved = (reread.fcmTokens || []).includes(svcToken);
    if (svcSaved) ok('saveToken() persisted the token to DB');
    else { bad('saveToken() did NOT persist the token'); failures++; }
  } catch (e) {
    bad(`saveToken() threw: ${e.message}`);
    failures++;
  }

  // ── 4. Cleanup (remove the two test tokens) ────────────────────────
  head('4. Cleanup');
  await User.updateOne(
    { _id: user.id },
    { $pull: { fcmTokens: { $in: [httpToken, svcToken] } } }
  );
  const final = await User.findById(user.id).select('fcmTokens');
  ok(`Removed test tokens — user now back to ${(final.fcmTokens || []).length} token(s)`);

  // ── Verdict ────────────────────────────────────────────────────────
  head('Verdict');
  if (failures === 0) {
    console.log('  \x1b[42m\x1b[30m PASS \x1b[0m Backend SAVE path works — a registered token IS persisted to the DB.');
    console.log('  If real browser logins still show 0 tokens, the cause is client-side');
    console.log('  (token minted but POST skipped/blocked), not the backend.');
  } else {
    console.log(`  \x1b[41m\x1b[37m ${failures} ISSUE(S) \x1b[0m Backend save path has a real problem — see ✗ lines.`);
  }

  await mongoose.disconnect();
  process.exit(failures === 0 ? 0 : 1);
};

run().catch(async (err) => {
  console.error(`check:fcm failed: ${err.message}`);
  try { await mongoose.disconnect(); } catch (_) { /* ignore */ }
  process.exit(1);
});
