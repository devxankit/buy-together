const joi = require('joi');

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

const listHomeSections = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', 'active', 'hidden'),
  }),
};

const createHomeSection = {
  body: joi.object().keys({
    title: joi.string().trim().min(2).max(80).required().messages({
      'any.required': 'Section heading is required',
    }),
    layout: joi.string().valid('carousel', 'list'),
    groups: joi.array().items(objectId),
    viewAllLink: joi.string().trim().max(250).allow('', null),
    isActive: joi.boolean(),
    displayOrder: joi.number().integer().min(0),
  }),
};

const updateHomeSection = {
  params: joi.object().keys({ sectionId: objectId.required() }),
  body: joi
    .object()
    .keys({
      title: joi.string().trim().min(2).max(80),
      layout: joi.string().valid('carousel', 'list'),
      groups: joi.array().items(objectId),
      viewAllLink: joi.string().trim().max(250).allow('', null),
      isActive: joi.boolean(),
      displayOrder: joi.number().integer().min(0),
    })
    .min(1),
};

const sectionId = {
  params: joi.object().keys({ sectionId: objectId.required() }),
};

module.exports = {
  listHomeSections,
  createHomeSection,
  updateHomeSection,
  sectionId,
};
