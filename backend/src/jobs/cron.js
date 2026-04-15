const cron = require('node-cron');
const logger = require('../utils/logger');

const setupJobs = () => {
  // Run every midnight
  cron.schedule('0 0 * * *', () => {
    logger.info('Running a midnight job to cleanup expired deals...');
    // cleanup logic here
  });
};

module.exports = setupJobs;
