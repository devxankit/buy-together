const socketio = require('socket.io');
const Redis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');
const config = require('../config/env');
const logger = require('../utils/logger');
const chatSocket = require('./chat.socket');

const setupSocket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: '*',
    },
  });

  // Realtime chat namespace (/chat).
  chatSocket(io);

  io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info('Socket disconnected');
    });
  });

  return io;
};

/**
 * Attach the Redis adapter so socket events broadcast across ALL app instances /
 * PM2 cluster workers. Without it, a message emitted on worker A never reaches a
 * client connected to worker B — chat silently breaks the moment you run more
 * than one process. No-op when Redis isn't configured (single in-memory adapter
 * is fine for a single process). Uses its own pub/sub connection pair, separate
 * from the cache client, as the adapter requires.
 */
const attachRedisAdapter = (io) => {
  if (!config.redis.enabled) {
    logger.info('Socket.IO using in-memory adapter (Redis disabled) — run a single process only');
    return;
  }

  // The adapter needs a dedicated pub client and a subscriber; both reconnect on
  // their own and must not take the server down, so swallow connection errors.
  const pubClient = new Redis(config.redis.url, { lazyConnect: false });
  const subClient = pubClient.duplicate();
  pubClient.on('error', (err) => logger.error(`Socket.IO Redis pub error: ${err.message}`));
  subClient.on('error', (err) => logger.error(`Socket.IO Redis sub error: ${err.message}`));

  io.adapter(createAdapter(pubClient, subClient));
  logger.info('Socket.IO Redis adapter active — events broadcast across all workers');
};

module.exports = setupSocket;
module.exports.attachRedisAdapter = attachRedisAdapter;
