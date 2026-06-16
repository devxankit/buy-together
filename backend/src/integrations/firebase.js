// Backwards-compatible shim. Real push logic now lives in services/push.service.js.
const pushService = require('../services/push.service');

/** Send a notification to a single token (legacy signature). */
const sendPushNotification = (token, payload) =>
  pushService.sendToTokens([token], payload);

module.exports = {
  sendPushNotification,
  ...pushService,
};
