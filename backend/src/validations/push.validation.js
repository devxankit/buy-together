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
    page: joi.number().integer().min(1),
  }),
};

const campaignId = {
  params: joi.object().keys({
    campaignId: joi.string().required(),
  }),
};

const bulkDeleteCampaigns = {
  body: joi.object().keys({
    ids: joi.array().items(joi.string()).min(1).required().messages({
      'array.min': 'Select at least one broadcast to delete',
      'any.required': 'No broadcasts selected',
    }),
  }),
};

module.exports = { sendBroadcast, listCampaigns, campaignId, bulkDeleteCampaigns };
