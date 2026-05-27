const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const cloudinary = require('../integrations/cloudinary');

// Allowed folder slugs the client may target (keeps the upload tree tidy/safe).
const FOLDERS = {
  categories: 'buy-together/categories',
  groups: 'buy-together/groups',
  misc: 'buy-together/misc',
};

const uploadImage = catchAsync(async (req, res) => {
  if (!cloudinary.isConfigured()) {
    throw new ApiError(
      httpStatus.SERVICE_UNAVAILABLE,
      'Image uploads are unavailable: Cloudinary is not configured on the server'
    );
  }
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided (form field name: image)');
  }

  const folder = FOLDERS[req.query.folder] || undefined;
  const result = await cloudinary.uploadImage(req.file.buffer, { folder });

  res.status(httpStatus.CREATED).send({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  });
});

module.exports = { uploadImage };
