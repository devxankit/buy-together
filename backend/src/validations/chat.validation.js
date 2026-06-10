const joi = require('joi');

const sendMessage = {
  body: joi.object().keys({
    groupId: joi.string().required(),
    content: joi.string().trim().max(4000).allow('').default(''),
    replyTo: joi
      .object()
      .keys({
        id: joi.string().required(),
        name: joi.string().allow('').default(''),
        content: joi.string().allow('').default(''),
      })
      .allow(null)
      .optional(),
    image: joi.string().allow('', null).optional(),
    documentData: joi.object().keys({
      name: joi.string().required(),
      size: joi.string().required(),
    }).optional(),
    locationData: joi.object().keys({
      lat: joi.string().required(),
      lng: joi.string().required(),
      city: joi.string().required(),
      mapUrl: joi.string().required(),
    }).optional(),
    voiceData: joi.object().keys({
      duration: joi.string().required(),
    }).optional(),
    type: joi.string().valid('text', 'image', 'document', 'location', 'voice', 'poll', 'quote').default('text'),
    quoteData: joi.object().unknown().optional(),
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
