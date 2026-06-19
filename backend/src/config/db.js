const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

// Surface connection lifecycle so a dropped DB shows up in the logs immediately
// instead of as silent 10s request buffering timeouts.
mongoose.connection.on('connected', () => logger.info('MongoDB connection established'));
mongoose.connection.on('error', (err) => logger.error(`MongoDB connection error: ${err.message}`));
mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected — retrying…'));
mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    logger.error('Check: cluster is running (not paused), your IP is allow-listed in Atlas, and the network allows outbound 27017/SRV DNS.');
    process.exit(1);
  }
};

module.exports = connectDB;
