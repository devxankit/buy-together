const http = require('http');
const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const setupSocket = require('./sockets/socket');

// Connect to Database
connectDB();

// Wrap Express in an HTTP server so Socket.IO can share the same port.
const server = http.createServer(app);

// Realtime layer — expose `io` to controllers via req.app.get('io').
const io = setupSocket(server);
app.set('io', io);

server.listen(config.port, () => {
  logger.info(`Server started on port ${config.port} (${config.env})`);
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
  if (server) {
    server.close();
  }
});
