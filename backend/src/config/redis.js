const redis = require('redis');
const config = require('./env');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

// redisClient.connect(); // Uncomment when redis server is available

module.exports = redisClient;
