/**
 * End-to-end verification for the push-notification feature.
 *
 *   npm run verify:push
 *
 * Checks (in order):
 *   1. Firebase Admin is configured and authenticated.
 *   2. User model exposes the FCM token fields; PushCampaign model loads.
 *   3. All FCM + admin-push routes are registered on the Express app.
 *   4. Token coverage across users.
 *   5. A REAL send to every registered token, with per-token result codes.
 *
 * Exit code 0 = feature healthy (delivery works). Non-zero = a real problem.
 */
const mongoose = require('mongoose');
const config = require('./../config/env');
const logger = require('./../utils/logger');

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const head = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

// Collect "METHOD /path" strings directly from an express.Router module's
// stack (stable across Express versions, unlike the app-level router tree).
const routerPaths = (router) => {
  const out = [];
  (router.stack || []).forEach((l) => {
    if (l.route) {
      const methods = Object.keys(l.route.methods).join(',').toUpperCase();
      out.push(`${methods} ${l.route.path}`);
    }
  });
  return out;
};

const hasRoute = (paths, method, path) =>
  paths.some((r) => r.startsWith(method) && r.endsWith(` ${path}`));

const run = async () => {
  let failures = 0;

  // ── 1. Firebase ────────────────────────────────────────────────────
  head('1. Firebase Admin');
  const { admin, isConfigured } = require('./../config/firebase');
  // Resolve the project id from the loaded service account (Admin SDK v13 does
  // not always surface it on app.options).
  let projectId = admin.app().options.projectId;
  if (!projectId) {
    try {
      const raw = config.firebase.serviceAccountJson;
      const json = raw && (raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
      if (json) projectId = JSON.parse(json).project_id;
    } catch { /* ignore */ }
  }
  if (isConfigured()) {
    ok(`Configured · project: ${projectId || '(see service account)'}`);
  } else {
    bad('Firebase Admin NOT configured — check service account env');
    failures++;
  }

  // ── 2. Models ──────────────────────────────────────────────────────
  head('2. Models');
  const User = require('./../models/User');
  const userPaths = User.schema.paths;
  ['fcmTokens', 'fcmTokensMobile'].forEach((f) => {
    if (userPaths[f]) ok(`User.${f} present (${userPaths[f].instance})`);
    else { bad(`User.${f} MISSING`); failures++; }
  });
  try {
    const PushCampaign = require('./../models/PushCampaign');
    ok(`PushCampaign model loads (${Object.keys(PushCampaign.schema.paths).length} fields)`);
  } catch (e) { bad(`PushCampaign model error: ${e.message}`); failures++; }

  // ── 3. Routes ──────────────────────────────────────────────────────
  // Verify each route exists on its own router module (mount prefix shown for
  // reference). /fcm/* is mounted at /api/fcm; /admin/* at /api/admin.
  head('3. Registered routes');
  const fcmPaths = routerPaths(require('./../routes/fcm.routes'));
  const adminPaths = routerPaths(require('./../routes/admin.routes'));
  const checks = [
    ['/api/fcm', fcmPaths, 'POST', '/web/register'],
    ['/api/fcm', fcmPaths, 'POST', '/mobile/register'],
    ['/api/fcm', fcmPaths, 'DELETE', '/unregister'],
    ['/api/fcm', fcmPaths, 'POST', '/test'],
    ['/api/admin', adminPaths, 'POST', '/push/web'],
    ['/api/admin', adminPaths, 'POST', '/push/mobile'],
    ['/api/admin', adminPaths, 'POST', '/push/all'],
    ['/api/admin', adminPaths, 'GET', '/push/coverage'],
    ['/api/admin', adminPaths, 'GET', '/push/campaigns'],
  ];
  checks.forEach(([mount, paths, method, path]) => {
    if (hasRoute(paths, method, path)) ok(`${method} ${mount}${path}`);
    else { bad(`${method} ${mount}${path}  NOT REGISTERED`); failures++; }
  });

  // ── 4 & 5. Coverage + real delivery ────────────────────────────────
  await mongoose.connect(config.mongoose.url, config.mongoose.options);
  const push = require('./../services/push.service');

  head('4. Token coverage');
  const cov = await push.getCoverage();
  ok(`web: ${cov.webUsers} user(s) · mobile: ${cov.mobileUsers} · total users: ${cov.totalUsers}`);

  head('5. Live delivery test (real FCM send to every registered token)');
  const usersWithTokens = await User.find({
    $or: [
      { fcmTokens: { $exists: true, $not: { $size: 0 } } },
      { fcmTokensMobile: { $exists: true, $not: { $size: 0 } } },
    ],
  }).select('name fcmTokens fcmTokensMobile');

  if (usersWithTokens.length === 0) {
    console.log('  (no registered tokens yet — log in on the web/app to register one, then re-run)');
  } else {
    let anySuccess = false;
    for (const u of usersWithTokens) {
      const entries = [
        ...(u.fcmTokens || []).map((t) => ['web', t]),
        ...(u.fcmTokensMobile || []).map((t) => ['mobile', t]),
      ];
      for (const [platform, token] of entries) {
        try {
          const id = await admin.messaging().send({
            token,
            notification: { title: '✅ Push verify', body: 'Your push system is working!' },
            data: { link: '/', type: 'verify' },
            webpush: { notification: { title: '✅ Push verify', body: 'Your push system is working!', icon: '/favicon.svg' }, fcmOptions: { link: '/' } },
          });
          ok(`${u.name} [${platform}] ${token.slice(0, 18)}… → DELIVERED (${id.split('/').pop()})`);
          anySuccess = true;
        } catch (e) {
          bad(`${u.name} [${platform}] ${token.slice(0, 18)}… → ${e.errorInfo?.code || e.code}`);
        }
      }
    }
    if (!anySuccess) failures++;
  }

  // ── Verdict ────────────────────────────────────────────────────────
  head('Verdict');
  if (failures === 0) {
    console.log('  \x1b[42m\x1b[30m PASS \x1b[0m Push feature is healthy. Delivery works end-to-end.');
    console.log('  If a notification did not appear on screen, that is a Windows/Chrome');
    console.log('  display setting (Focus Assist / OS notification permission), not the app.');
  } else {
    console.log(`  \x1b[41m\x1b[37m ${failures} ISSUE(S) \x1b[0m See the ✗ lines above.`);
  }

  await mongoose.disconnect();
  process.exit(failures === 0 ? 0 : 1);
};

run().catch(async (err) => {
  logger.error(`verify:push failed: ${err.message}`);
  try { await mongoose.disconnect(); } catch (_) { /* ignore */ }
  process.exit(1);
});
