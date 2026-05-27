const joi = require('joi');
const { ROLES, USER_STATUS, GENDERS } = require('../utils/constants');

const phone = joi
  .string()
  .pattern(/^(\+?91[\-\s]?)?[0]?[6-9]\d{9}$/)
  .messages({ 'string.pattern.base': 'Enter a valid 10-digit Indian mobile number' });

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

const listUsers = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', ...Object.values(USER_STATUS)),
    role: joi.string().valid('all', ...Object.values(ROLES)),
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
    sortBy: joi.string(),
  }),
};

const createUser = {
  body: joi.object().keys({
    name: joi.string().trim().min(2).max(80).required(),
    phone: phone.required(),
    email: joi.string().email({ tlds: false }).lowercase().allow('', null),
    role: joi.string().valid(...Object.values(ROLES)),
    status: joi.string().valid(...Object.values(USER_STATUS)),
    location: joi.string().allow('', null),
    gender: joi.string().valid(...Object.values(GENDERS)),
    dob: joi.date(),
    avatar: joi.string().uri().allow('', null),
    isPhoneVerified: joi.boolean(),
  }),
};

const userId = {
  params: joi.object().keys({ userId: objectId.required() }),
};

const updateUser = {
  params: joi.object().keys({ userId: objectId.required() }),
  body: joi
    .object()
    .keys({
      name: joi.string().trim().min(2).max(80),
      phone,
      email: joi.string().email({ tlds: false }).lowercase().allow('', null),
      role: joi.string().valid(...Object.values(ROLES)),
      status: joi.string().valid(...Object.values(USER_STATUS)),
      location: joi.string().allow('', null),
      gender: joi.string().valid(...Object.values(GENDERS)),
      dob: joi.date(),
      avatar: joi.string().uri().allow('', null),
      isPhoneVerified: joi.boolean(),
    })
    .min(1),
};

module.exports = {
  listUsers,
  createUser,
  userId,
  updateUser,
};
