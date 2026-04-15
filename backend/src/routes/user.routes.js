const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);

module.exports = router;
