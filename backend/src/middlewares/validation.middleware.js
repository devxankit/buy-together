const joi = require('joi');
const httpStatus = require('http-status');
const { pick } = require('../utils/helpers');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return res.status(httpStatus.BAD_REQUEST).send({ message: errorMessage });
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
