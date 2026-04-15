const httpStatus = require('http-status');
const chatService = require('../services/chat.service');

const sendMessage = async (req, res) => {
  const message = await chatService.createMessage({ ...req.body, sender: req.user.sub });
  res.status(httpStatus.CREATED).send(message);
};

const getMessages = async (req, res) => {
  const messages = await chatService.queryMessages(req.params.groupId);
  res.send(messages);
};

module.exports = {
  sendMessage,
  getMessages,
};
