const multer = require('multer');
const httpStatus = require('http-status').status;
const ApiError = require('../utils/ApiError');

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Keep files in memory — we stream the buffer straight to Cloudinary.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpe?g|png|webp|gif|avif|svg\+xml)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only image files are allowed (jpg, png, webp, gif, avif, svg)'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_BYTES } });

/**
 * Wraps multer's single-file handler so multer errors (e.g. file too large)
 * surface as clean 400s instead of being converted to 500 by the error handler.
 */
const single = (field) => (req, res, next) =>
  upload.single(field)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      const message =
        err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller' : err.message;
      return next(new ApiError(httpStatus.BAD_REQUEST, message));
    }
    return next(err);
  });

module.exports = { single, MAX_BYTES };
