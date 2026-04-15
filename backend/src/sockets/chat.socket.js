const logger = require('../utils/logger');

const chatSocket = (io) => {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    socket.on('join_group', (groupId) => {
      socket.join(groupId);
      logger.info(`User ${socket.id} joined group ${groupId}`);
    });

    socket.on('send_message', (data) => {
      chatNamespace.to(data.groupId).emit('new_message', data);
    });
  });
};

module.exports = chatSocket;
