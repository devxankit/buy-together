const mongoose = require('mongoose');
const httpStatus = require('http-status').status;
const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode;
    let message = error.message;

    if (error instanceof mongoose.Error.ValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
      message = Object.values(error.errors).map((e) => e.message).join(', ');
    } else if (error.code === 11000) {
      // Duplicate key (e.g. phone/email already exists)
      statusCode = httpStatus.CONFLICT;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `${field} already in use`;
    } else if (error instanceof mongoose.Error) {
      statusCode = httpStatus.BAD_REQUEST;
    }

    statusCode = statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    message = message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode || 500,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode || 500).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
