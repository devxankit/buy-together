const httpStatus = require('http-status').status;
const { admin, isConfigured } = require('../config/firebase');
const User = require('../models/User');
const PushCampaign = require('../models/PushCampaign');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const MAX_TOKENS_PER_USER = 10;
const FCM_BATCH_LIMIT = 500; // FCM caps multicast at 500 tokens per call.

// FCM error codes that unambiguously mean the token is dead and should be pruned.
const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

/**
 * Should this per-token send error cause the token to be pruned?
 * `messaging/invalid-argument` is overloaded — it can mean a bad *message* OR a
 * bad token — so we only treat it as dead when the message explicitly blames the
 * registration token. This avoids wiping every valid token on a payload bug.
 */
const isDeadTokenError = (error) => {
  const code = error?.code || '';
  if (DEAD_TOKEN_CODES.has(code)) return true;
  if (code === 'messaging/invalid-argument') {
    return /registration token/i.test(error?.message || '');
  }
  return false;
};

const fieldFor = (platform) => (platform === 'mobile' ? 'fcmTokensMobile' : 'fcmTokens');

// ── Token management ────────────────────────────────────────────────

/** Save (idempotently) an FCM token for a user, capped to the latest N. */
const saveToken = async (userId, token, platform = 'web') => {
  if (!token || typeof token !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A valid FCM token is required');
  }
  const field = fieldFor(platform);
  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const list = user[field] || [];
  if (!list.includes(token)) {
    list.push(token);
    if (list.length > MAX_TOKENS_PER_USER) {
      user[field] = list.slice(-MAX_TOKENS_PER_USER);
    } else {
      user[field] = list;
    }
    await user.save();
  }
  return { saved: true };
};

/** Remove a token from a user's pool (e.g. on logout / permission revoke). */
const removeToken = async (userId, token, platform = 'web') => {
  const field = fieldFor(platform);
  await User.updateOne({ _id: userId }, { $pull: { [field]: token } });
  return { removed: true };
};

/** Prune dead tokens across ALL users (called after a failed send). */
const pruneTokens = async (deadTokens) => {
  if (!deadTokens || deadTokens.length === 0) return;
  await User.updateMany(
    {},
    { $pull: { fcmTokens: { $in: deadTokens }, fcmTokensMobile: { $in: deadTokens } } }
  );
  logger.info(`Pruned ${deadTokens.length} dead FCM token(s)`);
};

// ── Low-level send ──────────────────────────────────────────────────

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

/**
 * Send a notification to a raw list of tokens. Returns delivery counts and the
 * set of dead tokens to prune. Handles image, deep-link, and per-platform
 * (web / Android / iOS) presentation.
 */
const sendToTokens = async (tokens, { title, body, image, link, data } = {}) => {
  if (!isConfigured()) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Firebase is not configured on the server');
  }
  const unique = [...new Set((tokens || []).filter(Boolean))];
  if (unique.length === 0) {
    return { recipients: 0, success: 0, failure: 0, deadTokens: [] };
  }

  // FCM requires an HTTPS URL for webpush.fcmOptions.link; a relative path
  // (e.g. "/messages/123") triggers messaging/invalid-argument. Click
  // navigation still works via data.link in the service worker, so we only set
  // fcmOptions.link for absolute URLs.
  const absoluteLink = link && /^https?:\/\//i.test(String(link)) ? String(link) : null;

  // Carry the display fields in `data` and coerce EVERY value to a string — the
  // FCM v1 API rejects non-string data values. The service worker / app reads
  // title+body from here.
  const dataPayload = Object.fromEntries(
    Object.entries({
      title: title || '',
      body: body || '',
      ...(link ? { link } : {}),
      ...(image ? { image } : {}),
      ...(data || {}),
    }).map(([k, v]) => [k, v == null ? '' : String(v)])
  );

  // IMPORTANT: no top-level `notification` field. A top-level notification makes
  // Android's OS auto-display the push AND fire onBackgroundMessage → TWO
  // notifications. Putting display data in `data` + `webpush.notification` defers
  // rendering to the service worker on every platform = exactly one notification.
  // (See tools/PUSH_NOTIFICATION_FLOW.md §6 — the battle-tested fix.)
  const baseMessage = {
    data: dataPayload,
    android: {
      priority: 'high',
    },
    apns: {
      headers: { 'apns-priority': '10' },
      payload: { aps: { 'mutable-content': 1, sound: 'default' } },
      ...(image ? { fcmOptions: { imageUrl: image } } : {}),
    },
    webpush: {
      headers: { Urgency: 'high' },
      notification: {
        title,
        body,
        ...(image ? { image } : {}),
        // No `icon`: the project ships only SVG icons, and an SVG (or a missing
        // PNG) makes Chrome/Windows SILENTLY DROP the notification. Letting the
        // browser use its default icon is what reliably renders in the tray.
      },
      fcmOptions: {
        ...(absoluteLink ? { link: absoluteLink } : {}),
      },
    },
  };

  let success = 0;
  let failure = 0;
  const deadTokens = [];

  const errorCounts = {};
  for (const batch of chunk(unique, FCM_BATCH_LIMIT)) {
    const res = await admin.messaging().sendEachForMulticast({ ...baseMessage, tokens: batch });
    success += res.successCount;
    failure += res.failureCount;
    res.responses.forEach((r, i) => {
      if (!r.success) {
        const code = r.error?.code || 'unknown';
        errorCounts[code] = (errorCounts[code] || 0) + 1;
        if (isDeadTokenError(r.error)) deadTokens.push(batch[i]);
      }
    });
  }

  // Surface why sends failed (e.g. messaging/third-party-auth-error → VAPID
  // mismatch) so misconfiguration is visible in the logs, not just a 0/N count.
  if (failure > 0) {
    logger.warn(`Push delivery failures: ${JSON.stringify(errorCounts)}`);
  }

  return { recipients: unique.length, success, failure, deadTokens };
};

// ── Targeted helper (used by app features to notify one user) ────────

/** Send to a single user across both platforms (best-effort, non-throwing). */
const sendToUser = async (userId, payload, includeMobile = true) => {
  try {
    const user = await User.findById(userId).select('fcmTokens fcmTokensMobile');
    if (!user) return;
    const tokens = [
      ...(user.fcmTokens || []),
      ...(includeMobile ? user.fcmTokensMobile || [] : []),
    ];
    const result = await sendToTokens(tokens, payload);
    await pruneTokens(result.deadTokens);
    return result;
  } catch (error) {
    logger.error(`sendToUser failed: ${error.message}`);
  }
};

// ── Admin broadcast ─────────────────────────────────────────────────

/** Collect every token for the chosen platform across all users. */
const collectTokens = async (platform) => {
  const fields =
    platform === 'web'
      ? ['fcmTokens']
      : platform === 'mobile'
      ? ['fcmTokensMobile']
      : ['fcmTokens', 'fcmTokensMobile'];

  const users = await User.find({
    $or: fields.map((f) => ({ [f]: { $exists: true, $not: { $size: 0 } } })),
  }).select(fields.join(' '));

  const tokens = [];
  users.forEach((u) => fields.forEach((f) => (u[f] || []).forEach((t) => tokens.push(t))));
  return [...new Set(tokens)];
};

/**
 * Broadcast a notification to all users on a platform ('web' | 'mobile' |
 * 'all'), prune dead tokens, and log the campaign.
 */
const broadcast = async ({ platform = 'all', title, body, image, link, sentBy, sentByName }) => {
  const tokens = await collectTokens(platform);
  const result = await sendToTokens(tokens, { title, body, image, link });
  await pruneTokens(result.deadTokens);

  const campaign = await PushCampaign.create({
    title,
    body,
    image: image || '',
    link: link || '',
    platform,
    stats: {
      recipients: result.recipients,
      success: result.success,
      failure: result.failure,
    },
    sentBy,
    sentByName: sentByName || '',
  });

  logger.info(
    `Push broadcast [${platform}] "${title}" → ${result.success}/${result.recipients} delivered`
  );
  return campaign;
};

/** Token coverage stats for the admin dashboard. */
const getCoverage = async () => {
  const [webUsers, mobileUsers, totalUsers] = await Promise.all([
    User.countDocuments({ fcmTokens: { $exists: true, $not: { $size: 0 } } }),
    User.countDocuments({ fcmTokensMobile: { $exists: true, $not: { $size: 0 } } }),
    User.countDocuments({}),
  ]);
  return { webUsers, mobileUsers, totalUsers };
};

/** Paginated campaign history (newest first). */
const listCampaigns = async ({ page = 1, limit = 20 } = {}) => {
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const safePage = Math.max(1, Number(page) || 1);
  const skip = (safePage - 1) * safeLimit;

  const [results, total] = await Promise.all([
    PushCampaign.find({}).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    PushCampaign.countDocuments({}),
  ]);

  return {
    results,
    page: safePage,
    limit: safeLimit,
    total,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
};

/** Delete a single campaign history record. */
const deleteCampaign = async (id) => {
  const campaign = await PushCampaign.findByIdAndDelete(id);
  if (!campaign) throw new ApiError(httpStatus.NOT_FOUND, 'Broadcast not found');
  return campaign;
};

/** Delete many campaign history records at once. */
const deleteCampaigns = async (ids = []) => {
  const result = await PushCampaign.deleteMany({ _id: { $in: ids } });
  return { deletedCount: result.deletedCount || 0 };
};

module.exports = {
  saveToken,
  removeToken,
  pruneTokens,
  sendToTokens,
  sendToUser,
  broadcast,
  getCoverage,
  listCampaigns,
  deleteCampaign,
  deleteCampaigns,
};
