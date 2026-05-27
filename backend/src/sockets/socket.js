const socketio = require('socket.io');
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

module.exports = setupSocket;
