const joi = require('joi');

const sendMessage = {
  body: joi.object().keys({
    groupId: joi.string().required(),
    content: joi.string().trim().min(1).max(4000).required(),
    replyTo: joi
      .object()
      .keys({
        id: joi.string().required(),
        name: joi.string().allow('').default(''),
        content: joi.string().allow('').default(''),
      })
      .optional(),
  }),
};

const getMessages = {
  params: joi.object().keys({
    groupId: joi.string().required(),
  }),
  query: joi.object().keys({
    limit: joi.number().integer().min(1).max(500).default(100),
  }),
};

module.exports = {
  sendMessage,
  getMessages,
};
