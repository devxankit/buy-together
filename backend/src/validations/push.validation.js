const joi = require('joi');

const sendBroadcast = {
  body: joi.object().keys({
    title: joi.string().trim().min(1).max(120).required().messages({
      'any.required': 'Notification title is required',
    }),
    body: joi.string().trim().min(1).max(500).required().messages({
      'any.required': 'Notification message is required',
    }),
    image: joi.string().trim().uri().allow('', null).messages({
      'string.uri': 'Image must be a valid URL',
    }),
    link: joi.string().trim().max(500).allow('', null),
  }),
};

const listCampaigns = {
  query: joi.object().keys({
    limit: joi.number().integer().min(1).max(100),
  }),
};

module.exports = { sendBroadcast, listCampaigns };
