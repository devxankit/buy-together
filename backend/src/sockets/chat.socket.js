const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');
const pushService = require('../services/push.service');
const Group = require('../models/Group');

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
      // Also stash on `data` — fetchSockets() (used for room presence) only
      // exposes socket.data, not arbitrary props like socket.user.
      socket.data.userId = String(decoded.sub);
      return next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    const userIdStr = socket.user?.id ? String(socket.user.id) : null;
    if (userIdStr) {
      // Personal room for user-targeted events (e.g. DM unread-badge updates)
      // even when the user isn't viewing any specific chat.
      socket.join(`user:${userIdStr}`);
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

/** Short, human preview of a message for a notification body. */
const messagePreview = (m) => {
  if (m && m.content && String(m.content).trim()) {
    const t = String(m.content).trim();
    return t.length > 120 ? `${t.slice(0, 117)}…` : t;
  }
  switch (m && m.type) {
    case 'image': return '📷 Photo';
    case 'video': return '🎥 Video';
    case 'document': return '📄 Document';
    case 'location': return '📍 Location';
    case 'voice': return '🎤 Voice message';
    case 'poll': return '📊 Poll';
    default: return 'New message';
  }
};

/**
 * WhatsApp-style chat push. Sends a push notification to a message's recipients,
 * but SKIPS anyone who currently has that conversation open (their socket is
 * joined to the room) — so an active reader never gets a redundant buzz.
 *
 * Best-effort and non-throwing: never breaks the send request.
 */
const notifyNewMessage = async (io, message) => {
  try {
    if (!message || !message.groupId) return;
    const roomId = String(message.groupId);
    const senderId = String(message.senderId);
    const isDM = roomId.startsWith('dm-');

    // Who is currently viewing this chat (socket joined to the room)?
    const active = new Set();
    if (io) {
      try {
        const sockets = await io.of(CHAT_NAMESPACE).in(roomId).fetchSockets();
        sockets.forEach((s) => { if (s.data?.userId) active.add(String(s.data.userId)); });
      } catch (e) { /* presence is best-effort */ }
    }

    // Resolve recipients + a display title for the notification.
    let recipientIds = [];
    let title;
    if (isDM) {
      const parts = roomId.split('-'); // dm-<a>-<b>
      if (parts.length === 3) recipientIds = [parts[1], parts[2]];
      title = message.senderName || 'New message';
    } else if (/^[0-9a-fA-F]{24}$/.test(roomId)) {
      const group = await Group.findById(roomId).select('members admin title productName');
      if (!group) return;
      recipientIds = (group.members || []).map(String);
      if (group.admin) recipientIds.push(String(group.admin));
      title = group.title || group.productName || 'Group chat';
    } else {
      return; // unknown room type
    }

    // Exclude the sender and anyone actively reading the chat. Dedupe.
    const targets = [...new Set(recipientIds.map(String))].filter(
      (id) => id && id !== senderId && !active.has(id)
    );
    if (targets.length === 0) return;

    const preview = messagePreview(message);
    const body = isDM ? preview : `${message.senderName || 'Someone'}: ${preview}`;
    const link = isDM ? `/messages/${senderId}` : `/groups/${roomId}/chat`;
    const data = {
      type: isDM ? 'dm' : 'group',
      roomId,
      senderId,
      timestamp: String(message.createdAt || Date.now()),
    };

    await Promise.all(targets.map((id) => pushService.sendToUser(id, { title, body, link, data })));
  } catch (err) {
    logger.error(`notifyNewMessage failed: ${err.message}`);
  }
};

module.exports = chatSocket;
module.exports.chatSocket = chatSocket;
module.exports.emitNewMessage = emitNewMessage;
module.exports.notifyNewMessage = notifyNewMessage;
module.exports.CHAT_NAMESPACE = CHAT_NAMESPACE;
