const Message = require('../models/Message');

const createMessage = async (messageBody) => {
  return Message.create(messageBody);
};

const queryMessages = async (groupId) => {
  return Message.find({ group: groupId }).populate('sender', 'name');
};

module.exports = {
  createMessage,
  queryMessages,
};
