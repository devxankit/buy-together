/**
 * Wraps an async controller so any rejected promise is forwarded to Express's
 * error handler. (Express 5 already forwards async rejections, but wrapping
 * keeps intent explicit and stays safe if handlers are reused elsewhere.)
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
