const httpStatus = require('http-status').status;
const { admin, isConfigured } = require('../config/firebase');
const User = require('../models/User');
const PushCampaign = require('../models/PushCampaign');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const MAX_TOKENS_PER_USER = 10;
const FCM_BATCH_LIMIT = 500; // FCM caps multicast at 500 tokens per call.

// FCM error codes that mean the token is dead and should be pruned.
const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
]);

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

  // Shared data payload (strings only — FCM data values must be strings).
  const dataPayload = {
    ...(link ? { link: String(link) } : {}),
    ...(image ? { image: String(image) } : {}),
    ...(data || {}),
  };

  const baseMessage = {
    notification: {
      title,
      body,
      ...(image ? { imageUrl: image } : {}),
    },
    data: dataPayload,
    android: {
      priority: 'high',
      notification: {
        ...(image ? { imageUrl: image } : {}),
      },
    },
    apns: {
      payload: { aps: { 'mutable-content': 1 } },
      ...(image ? { fcmOptions: { imageUrl: image } } : {}),
    },
    webpush: {
      notification: {
        title,
        body,
        ...(image ? { image } : {}),
        icon: '/favicon.png',
      },
      fcmOptions: {
        ...(link ? { link: String(link) } : {}),
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
        if (DEAD_TOKEN_CODES.has(code)) deadTokens.push(batch[i]);
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

/** Recent campaign history. */
const listCampaigns = async (limit = 20) => {
  return PushCampaign.find({}).sort({ createdAt: -1 }).limit(Math.min(100, limit));
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
};
