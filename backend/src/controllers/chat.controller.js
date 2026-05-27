const httpStatus = require('http-status').status;
const chatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');
const { emitNewMessage } = require('../sockets/chat.socket');

const sendMessage = catchAsync(async (req, res) => {
  const { groupId, content, replyTo } = req.body;
  const message = await chatService.createMessage({
    groupId,
    senderId: req.user._id,
    senderName: req.user.name,
    content,
    replyTo,
  });

  // Push the persisted message to everyone listening on the group's room.
  emitNewMessage(req.app.get('io'), groupId, message);

  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  await chatService.verifyGroupAccess(req.params.groupId, req.user._id);
  const messages = await chatService.queryMessages(req.params.groupId, {
    limit: req.query.limit,
  });
  res.send(messages);
});

module.exports = {
  sendMessage,
  getMessages,
};
