const http = require('http');
const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const { connectRedis, disconnectRedis } = require('./config/redis');
const cache = require('./utils/cache');
const setupSocket = require('./sockets/socket');
const { attachRedisAdapter } = require('./sockets/socket');

// Wrap Express in an HTTP server so Socket.IO can share the same port.
const server = http.createServer(app);

// Realtime layer — expose `io` to controllers via req.app.get('io').
const io = setupSocket(server);
app.set('io', io);

// Connect to the database first, then start accepting requests. This avoids the
// server serving requests that just buffer and time out before Mongo is ready.
connectDB().then(async () => {
  // Redis is optional — connectRedis never throws. If it's unavailable the
  // cache silently runs memory-only, so this must not block startup on failure.
  await connectRedis();
  cache.subscribeInvalidations();
  // Wire Socket.IO across workers now that Redis is connected (no-op if disabled).
  attachRedisAdapter(io);

  server.listen(config.port, () => {
    logger.info(`Server started on port ${config.port} (${config.env})`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  disconnectRedis();
  if (server) {
    server.close();
  }
});
