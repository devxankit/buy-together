/**
 * ApiError carries an HTTP status code through to the error handler, which
 * reads `statusCode` / `isOperational`. Throw this from services/controllers
 * instead of a bare Error so clients get a meaningful status (400/401/404…).
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
