const logger = require('../utils/logger');

const processPayment = async (amount, currency) => {
  logger.info(`Processing payment of ${amount} ${currency}`);
  return { success: true, transactionId: 'TXN_' + Date.now() };
};

module.exports = {
  processPayment,
};
