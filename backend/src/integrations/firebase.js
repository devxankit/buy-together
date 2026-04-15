const logger = require('../utils/logger');

const sendPushNotification = async (token, payload) => {
  logger.info(`Sending Firebase push notification to ${token}`);
  return { success: true };
};

module.exports = {
  sendPushNotification,
};
