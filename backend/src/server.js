const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const server = app.listen(config.port, () => {
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
