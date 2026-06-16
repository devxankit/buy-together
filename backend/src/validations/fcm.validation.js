const joi = require('joi');

const registerToken = {
  body: joi.object().keys({
    token: joi.string().trim().min(10).required().messages({
      'any.required': 'FCM token is required',
    }),
  }),
};

const unregisterToken = {
  body: joi.object().keys({
    token: joi.string().trim().required(),
    platform: joi.string().valid('web', 'mobile'),
  }),
};

const testNotification = {
  body: joi.object().keys({
    title: joi.string().trim().max(120).allow('', null),
    body: joi.string().trim().max(500).allow('', null),
    link: joi.string().trim().max(500).allow('', null),
  }),
};

module.exports = { registerToken, unregisterToken, testNotification };
