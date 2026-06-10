const cloudinary = require('cloudinary').v2;
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * Cloudinary image hosting. Used for admin uploads (e.g. category covers).
 * If credentials are absent the app still boots — the upload endpoint reports
 * 503 until CLOUDINARY_* env vars are provided.
 */
let configured = false;

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
  configured = true;
  logger.info('Cloudinary configured (image uploads ready)');
} else {
  logger.warn('Cloudinary not configured — image uploads disabled until CLOUDINARY_* env vars are set');
}

const isConfigured = () => configured;

/**
 * Upload an in-memory image buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {object} [opts]
 * @param {string} [opts.folder] override the default upload folder
 * @returns {Promise<object>} the Cloudinary upload result (secure_url, public_id, …)
 */
const uploadImage = (buffer, { folder } = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || config.cloudinary.folder, resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

module.exports = {
  cloudinary,
  isConfigured,
  uploadImage,
};
