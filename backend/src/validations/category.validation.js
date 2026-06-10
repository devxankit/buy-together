const joi = require('joi');

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

const listCategories = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', 'active', 'hidden'),
  }),
};

const createCategory = {
  body: joi.object().keys({
    name: joi.string().trim().min(2).max(60).required(),
    image: joi.string().uri().required().messages({
      'string.uri': 'Image must be a valid URL',
      'any.required': 'A cover image is required',
    }),
    slug: joi.string().trim().lowercase().allow('', null),
    icon: joi.string().trim().allow('', null),
    description: joi.string().trim().max(300).allow('', null),
    color: joi.string().trim().allow('', null),
    displayOrder: joi.number().integer().min(0),
    isActive: joi.boolean(),
    subCategories: joi.array().items(joi.string().trim().max(60)),
  }),
};

const updateCategory = {
  params: joi.object().keys({ categoryId: objectId.required() }),
  body: joi
    .object()
    .keys({
      name: joi.string().trim().min(2).max(60),
      image: joi.string().uri().messages({ 'string.uri': 'Image must be a valid URL' }),
      slug: joi.string().trim().lowercase().allow('', null),
      icon: joi.string().trim().allow('', null),
      description: joi.string().trim().max(300).allow('', null),
      color: joi.string().trim().allow('', null),
      displayOrder: joi.number().integer().min(0),
      isActive: joi.boolean(),
      subCategories: joi.array().items(joi.string().trim().max(60)),
    })
    .min(1),
};

const categoryId = {
  params: joi.object().keys({ categoryId: objectId.required() }),
};

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  categoryId,
};
