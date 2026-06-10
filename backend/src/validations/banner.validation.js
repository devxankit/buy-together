const joi = require('joi');

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

const listBanners = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', 'active', 'hidden'),
  }),
};

const createBanner = {
  body: joi.object().keys({
    badge: joi.string().trim().max(40).required(),
    titleLine1: joi.string().trim().max(60).required(),
    titleHighlight: joi.string().trim().max(60).required(),
    description: joi.string().trim().max(250).required(),
    image: joi.string().uri().required().messages({
      'string.uri': 'Image must be a valid URL',
      'any.required': 'Banner image is required',
    }),
    activeBuyers: joi.string().trim().max(20).allow('', null),
    link: joi.string().trim().max(250).allow('', null),
    isActive: joi.boolean(),
    displayOrder: joi.number().integer().min(0),
  }),
};

const updateBanner = {
  params: joi.object().keys({ bannerId: objectId.required() }),
  body: joi
    .object()
    .keys({
      badge: joi.string().trim().max(40),
      titleLine1: joi.string().trim().max(60),
      titleHighlight: joi.string().trim().max(60),
      description: joi.string().trim().max(250),
      image: joi.string().uri().messages({ 'string.uri': 'Image must be a valid URL' }),
      activeBuyers: joi.string().trim().max(20).allow('', null),
      link: joi.string().trim().max(250).allow('', null),
      isActive: joi.boolean(),
      displayOrder: joi.number().integer().min(0),
    })
    .min(1),
};

const bannerId = {
  params: joi.object().keys({ bannerId: objectId.required() }),
};

module.exports = {
  listBanners,
  createBanner,
  updateBanner,
  bannerId,
};
