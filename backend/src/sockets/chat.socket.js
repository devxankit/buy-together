const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');

const CHAT_NAMESPACE = '/chat';

/**
 * Realtime chat transport.
 *
 * Firebase RTDB is the message *store*; this Socket.IO namespace is how live
 * messages reach connected browsers (the frontend doesn't hold Firebase web
 * credentials). Flow: client POSTs a message -> controller writes it to RTDB ->
 * controller calls `emitNewMessage` -> all sockets in that group's room get it.
 */
const chatSocket = (io) => {
  const chatNamespace = io.of(CHAT_NAMESPACE);
  const onlineUsers = {}; // Track user connection counts (userId -> socketCount)

  // Authenticate every chat socket with the same JWT used by the REST API.
  chatNamespace.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = { id: decoded.sub, role: decoded.role };
      return next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    const userIdStr = socket.user?.id ? String(socket.user.id) : null;
    if (userIdStr) {
      onlineUsers[userIdStr] = (onlineUsers[userIdStr] || 0) + 1;
      if (onlineUsers[userIdStr] === 1) {
        chatNamespace.emit('user_status', { userId: userIdStr, status: 'online' });
      }
    }

    logger.info(`Chat socket connected: ${socket.id} (user ${socket.user?.id})`);

    socket.on('join_group', (groupId) => {
      if (!groupId) return;
      socket.join(String(groupId));
      logger.info(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('leave_group', (groupId) => {
      if (!groupId) return;
      socket.leave(String(groupId));
    });

    socket.on('get_user_status', (targetUserId, callback) => {
      if (typeof callback === 'function') {
        const isOnline = !!onlineUsers[String(targetUserId)];
        callback({ status: isOnline ? 'online' : 'offline' });
      }
    });

    socket.on('typing', ({ groupId, userName }) => {
      if (!groupId) return;
      socket.to(String(groupId)).emit('user_typing', { groupId, userId: socket.user?.id, userName });
    });

    socket.on('stop_typing', ({ groupId }) => {
      if (!groupId) return;
      socket.to(String(groupId)).emit('user_stop_typing', { groupId, userId: socket.user?.id });
    });

    socket.on('disconnect', () => {
      if (userIdStr && onlineUsers[userIdStr]) {
        onlineUsers[userIdStr]--;
        if (onlineUsers[userIdStr] === 0) {
          delete onlineUsers[userIdStr];
          chatNamespace.emit('user_status', { userId: userIdStr, status: 'offline' });
        }
      }
      logger.info(`Chat socket disconnected: ${socket.id}`);
    });
  });

  return chatNamespace;
};

/**
 * Broadcast a persisted message to a group's room. Safe to call when sockets
 * aren't wired (io null) — it simply no-ops.
 */
const emitNewMessage = (io, groupId, message) => {
  if (!io) return;
  io.of(CHAT_NAMESPACE).to(String(groupId)).emit('new_message', message);
};

module.exports = chatSocket;
module.exports.chatSocket = chatSocket;
module.exports.emitNewMessage = emitNewMessage;
module.exports.CHAT_NAMESPACE = CHAT_NAMESPACE;
