const httpStatus = require('http-status').status;
const chatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { emitNewMessage, notifyNewMessage } = require('../sockets/chat.socket');
const firebase = require('../config/firebase');
const User = require('../models/User');

/** Deterministic DM room id for a pair of users (sorted, so both sides match). */
const dmRoomId = (a, b) => {
  const sorted = [String(a), String(b)].sort();
  return `dm-${sorted[0]}-${sorted[1]}`;
};

const sendMessage = catchAsync(async (req, res) => {
  const message = await chatService.createMessage({
    ...req.body,
    senderId: req.user._id,
    senderName: req.user.name,
  });

  // Push the persisted message to everyone listening on the group's room.
  const io = req.app.get('io');
  emitNewMessage(io, message.groupId, message);

  // WhatsApp-style: notify recipients who do NOT have this chat open. Fire and
  // forget — never block or fail the send on a push error.
  notifyNewMessage(io, message).catch(() => {});

  // For DMs, ping the recipient's personal room so their messages badge updates
  // live even when they're not viewing this chat (no page reload needed).
  if (io && String(message.groupId).startsWith('dm-')) {
    const parts = String(message.groupId).split('-');
    if (parts.length === 3) {
      const senderIdStr = String(req.user._id);
      const recipientId = senderIdStr === parts[1] ? parts[2] : parts[1];
      io.of('/chat').to(`user:${recipientId}`).emit('dm_notification', {
        roomId: message.groupId,
        fromUserId: senderIdStr,
        fromName: message.senderName,
        lastMessage: message.content || '',
        createdAt: message.createdAt,
      });
    }
  }

  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  await chatService.verifyGroupAccess(req.params.groupId, req.user._id);
  const messages = await chatService.queryMessages(req.params.groupId, {
    limit: req.query.limit,
  });
  res.send(messages);
});

const voteMessage = catchAsync(async (req, res) => {
  const { groupId, messageId } = req.params;
  const { optionIndex } = req.body;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const ref = firebase.getGroupMessagesRef(groupId).child(messageId).child('quoteData/votesMap');
  const currentVoteSnap = await ref.child(String(userId)).once('value');
  const currentVote = currentVoteSnap.val();

  if (currentVote === optionIndex) {
    await ref.child(String(userId)).remove();
  } else {
    await ref.child(String(userId)).set(optionIndex);
  }

  const msgRef = firebase.getGroupMessagesRef(groupId).child(messageId);
  const snapshot = await msgRef.once('value');
  const updatedMessage = { id: messageId, groupId, ...snapshot.val() };

  emitNewMessage(req.app.get('io'), groupId, updatedMessage);
  res.send(updatedMessage);
});

const getConversations = catchAsync(async (req, res) => {
  const userId = req.user._id;

  if (!firebase.isConfigured()) {
    return res.send([]);
  }

  const db = firebase.getDatabase();
  const convoSnap = await db.ref(`conversations/${userId}`).once('value');
  const convoVal = convoSnap.val();

  if (!convoVal) {
    return res.send([]);
  }

  const otherUserIds = Object.keys(convoVal);

  // Batch query all users from MongoDB in one roundtrip
  const users = await User.find({ _id: { $in: otherUserIds } }).select('name avatar');

  // Create a map for O(1) lookup
  const userMap = new Map();
  users.forEach((u) => {
    userMap.set(String(u._id || u.id), u);
  });

  const conversations = [];

  for (const otherUserId of otherUserIds) {
    const convoInfo = convoVal[otherUserId];
    const otherUser = userMap.get(String(otherUserId));

    if (otherUser) {
      conversations.push({
        id: otherUserId,
        name: otherUser.name,
        avatar: otherUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'User')}&background=random`,
        lastMessage: convoInfo.lastMessage || '',
        time: convoInfo.updatedAt ? new Date(convoInfo.updatedAt).toISOString() : new Date().toISOString(),
        updatedAt: convoInfo.updatedAt || Date.now(),
        unread: convoInfo.unread || 0,
      });
    }
  }

  // Sort by updatedAt descending (newest first)
  conversations.sort((a, b) => b.updatedAt - a.updatedAt);

  res.send(conversations);
});

const pinMessage = catchAsync(async (req, res) => {
  const { groupId, messageId } = req.params;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const msgSnap = await firebase.getGroupMessagesRef(groupId).child(messageId).once('value');
  const msgVal = msgSnap.val();

  if (!msgVal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  const pinnedMessage = {
    id: messageId,
    content: msgVal.content || '',
    senderName: msgVal.senderName || 'User',
    createdAt: msgVal.createdAt || Date.now(),
  };

  const db = firebase.getDatabase();
  await db.ref(`pinned/${groupId}`).set(pinnedMessage);

  const io = req.app.get('io');
  if (io) {
    io.of('/chat').to(String(groupId)).emit('message_pinned', pinnedMessage);
  }

  res.status(httpStatus.OK).send(pinnedMessage);
});

const unpinMessage = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const db = firebase.getDatabase();
  await db.ref(`pinned/${groupId}`).remove();

  const io = req.app.get('io');
  if (io) {
    io.of('/chat').to(String(groupId)).emit('message_unpinned', { groupId });
  }

  res.status(httpStatus.NO_CONTENT).send();
});

const getPinnedMessage = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const db = firebase.getDatabase();
  const snap = await db.ref(`pinned/${groupId}`).once('value');
  const val = snap.val();

  res.send(val || null);
});

const deleteMessage = catchAsync(async (req, res) => {
  const { groupId, messageId } = req.params;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const msgRef = firebase.getGroupMessagesRef(groupId).child(messageId);
  const snap = await msgRef.once('value');
  const msgVal = snap.val();

  if (!msgVal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }

  // Check permissions: strictly only sender can delete
  const canDelete = String(msgVal.senderId) === String(userId);

  if (!canDelete) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own messages');
  }

  await msgRef.remove();

  // Broadcast deletion to Socket.IO namespace
  const io = req.app.get('io');
  if (io) {
    io.of('/chat').to(String(groupId)).emit('message_deleted', { messageId, groupId });
  }

  res.status(httpStatus.NO_CONTENT).send();
});

const reactMessage = catchAsync(async (req, res) => {
  const { groupId, messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user._id;

  await chatService.verifyGroupAccess(groupId, userId);

  const ref = firebase.getGroupMessagesRef(groupId).child(messageId).child('reactions');
  const currentSnap = await ref.child(String(userId)).once('value');
  const currentEmoji = currentSnap.val();

  if (currentEmoji === emoji) {
    await ref.child(String(userId)).remove();
  } else {
    await ref.child(String(userId)).set(emoji);
  }

  const msgRef = firebase.getGroupMessagesRef(groupId).child(messageId);
  const snapshot = await msgRef.once('value');
  const updatedMessage = { id: messageId, groupId, ...snapshot.val() };

  emitNewMessage(req.app.get('io'), groupId, updatedMessage);
  res.send(updatedMessage);
});

const clearUnreadCount = catchAsync(async (req, res) => {
  const userId = String(req.user._id);
  const { otherUserId } = req.params;
  let otherLastRead = 0;

  if (firebase.isConfigured()) {
    const db = firebase.getDatabase();
    const now = Date.now();
    const roomId = dmRoomId(userId, otherUserId);

    await Promise.all([
      db.ref(`conversations/${userId}/${otherUserId}`).update({ unread: 0 }),
      // Persist this user's read marker for the room (drives the sender's ticks).
      db.ref(`reads/${roomId}/${userId}`).set(now),
    ]);

    // The other participant's last-read time → used to colour MY sent ticks blue.
    const otherSnap = await db.ref(`reads/${roomId}/${otherUserId}`).once('value');
    otherLastRead = otherSnap.val() || 0;

    // Tell the other user's open chat to turn their sent-message ticks blue.
    const io = req.app.get('io');
    if (io) {
      io.of('/chat').to(roomId).emit('messages_read', { roomId, readerId: userId, at: now });
    }
  }

  res.status(httpStatus.OK).send({ success: true, otherLastRead });
});

// ── Admin (read-only moderation views) ──────────────────────────────
// These bypass membership checks: the admin middleware already gates access.

/** Admin: read any group's full chat transcript. */
const adminGetGroupMessages = catchAsync(async (req, res) => {
  const messages = await chatService.queryMessages(req.params.groupId, {
    limit: req.query.limit || 500,
  });
  res.send(messages);
});

/** Admin: list the people a given user has one-to-one chats with. */
const adminGetUserConversations = catchAsync(async (req, res) => {
  const { userId } = req.params;

  if (!firebase.isConfigured()) return res.send([]);

  const db = firebase.getDatabase();
  const convoSnap = await db.ref(`conversations/${userId}`).once('value');
  const convoVal = convoSnap.val();
  if (!convoVal) return res.send([]);

  const otherUserIds = Object.keys(convoVal);
  const users = await User.find({ _id: { $in: otherUserIds } }).select('name avatar phone');
  const userMap = new Map();
  users.forEach((u) => userMap.set(String(u._id || u.id), u));

  const conversations = otherUserIds
    .map((otherUserId) => {
      const info = convoVal[otherUserId] || {};
      const other = userMap.get(String(otherUserId));
      if (!other) return null;
      return {
        id: otherUserId,
        name: other.name,
        phone: other.phone || '',
        avatar:
          other.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name || 'User')}&background=random`,
        lastMessage: info.lastMessage || '',
        updatedAt: info.updatedAt || 0,
        time: info.updatedAt ? new Date(info.updatedAt).toISOString() : null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  res.send(conversations);
});

/** Admin: read the one-to-one transcript between two users. */
const adminGetDmMessages = catchAsync(async (req, res) => {
  const { userId, otherUserId } = req.params;
  const roomId = dmRoomId(userId, otherUserId);
  const messages = await chatService.queryMessages(roomId, {
    limit: req.query.limit || 500,
  });
  res.send(messages);
});

module.exports = {
  sendMessage,
  getMessages,
  voteMessage,
  getConversations,
  pinMessage,
  unpinMessage,
  getPinnedMessage,
  deleteMessage,
  reactMessage,
  clearUnreadCount,
  adminGetGroupMessages,
  adminGetUserConversations,
  adminGetDmMessages,
};

