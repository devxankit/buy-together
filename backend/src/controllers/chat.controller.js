const httpStatus = require('http-status').status;
const chatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { emitNewMessage } = require('../sockets/chat.socket');
const firebase = require('../config/firebase');
const User = require('../models/User');

const sendMessage = catchAsync(async (req, res) => {
  const message = await chatService.createMessage({
    ...req.body,
    senderId: req.user._id,
    senderName: req.user.name,
  });

  // Push the persisted message to everyone listening on the group's room.
  emitNewMessage(req.app.get('io'), message.groupId, message);

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
        avatar: otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        lastMessage: convoInfo.lastMessage || '',
        time: convoInfo.updatedAt ? new Date(convoInfo.updatedAt).toISOString() : new Date().toISOString(),
        updatedAt: convoInfo.updatedAt || Date.now(),
        unread: 0,
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

module.exports = {
  sendMessage,
  getMessages,
  voteMessage,
  getConversations,
  pinMessage,
  unpinMessage,
  getPinnedMessage,
};
