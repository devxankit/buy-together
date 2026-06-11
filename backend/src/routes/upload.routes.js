const express = require('express');
const auth = require('../middlewares/auth.middleware');
const { single, mediaSingle } = require('../middlewares/upload.middleware');
const uploadController = require('../controllers/upload.controller');

const router = express.Router();

router.post('/image', auth, single('image'), uploadController.uploadImage);
router.post('/media', auth, mediaSingle('media'), uploadController.uploadMedia);

module.exports = router;
