const joi = require('joi');
const { CONTENT_PAGE_SLUGS } = require('../utils/constants');

const slugParam = joi.string().valid(...CONTENT_PAGE_SLUGS).messages({
  'any.only': 'Unknown content page',
});

const section = joi.object().keys({
  // Allow an existing _id/id to pass through harmlessly on edit.
  _id: joi.any().strip(),
  id: joi.any().strip(),
  icon: joi.string().trim().allow('', null).max(16),
  title: joi.string().trim().allow('', null).max(200),
  body: joi.string().trim().allow('', null).max(6000),
});

const getPublicPage = {
  params: joi.object().keys({ slug: slugParam.required() }),
};

const getPage = {
  params: joi.object().keys({ slug: slugParam.required() }),
};

const updatePage = {
  params: joi.object().keys({ slug: slugParam.required() }),
  body: joi
    .object()
    .keys({
      title: joi.string().trim().min(2).max(120),
      intro: joi.string().trim().allow('', null).max(2000),
      lastUpdated: joi.string().trim().allow('', null).max(60),
      contactEmail: joi.string().trim().email({ tlds: false }).allow('', null).max(120),
      sections: joi.array().items(section),
      isActive: joi.boolean(),
    })
    .min(1),
};

module.exports = {
  getPublicPage,
  getPage,
  updatePage,
};
