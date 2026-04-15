const logger = require('../utils/logger');

const sendNotification = async (userId, message) => {
  // Logic to send push/email notifications
  logger.info(`Notification sent to ${userId}: ${message}`);
};

module.exports = {
  sendNotification,
};
