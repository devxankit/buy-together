const joi = require('joi');

const createGroup = {
  body: joi.object().keys({
    name: joi.string().required(),
    description: joi.string(),
  }),
};

module.exports = {
  createGroup,
};
