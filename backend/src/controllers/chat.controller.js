const httpStatus = require('http-status').status;
const chatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');
const { emitNewMessage } = require('../sockets/chat.socket');
const firebase = require('../config/firebase');

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

module.exports = {
  sendMessage,
  getMessages,
  voteMessage,
};
