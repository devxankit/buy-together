const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/auth.middleware');
const { single } = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

// Admin-only image upload → Cloudinary. Returns { url, publicId, … }.
router.post('/image', auth, single('image'), uploadController.uploadImage);

module.exports = router;
