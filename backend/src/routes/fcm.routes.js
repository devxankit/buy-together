const express = require('express');
const fcmController = require('../controllers/fcm.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const fcmValidation = require('../validations/fcm.validation');

const router = express.Router();

// All token routes require an authenticated user. Web and mobile are kept on
// separate endpoints so each client platform registers its own token pool.

// Web browser token (React app / PWA).
router.post('/web/register', auth, validate(fcmValidation.registerToken), fcmController.registerWeb);

// Unified registration route (taking token and platform in body).
router.post('/register', auth, validate(fcmValidation.registerToken), fcmController.register);

// Mobile app token (Flutter / native Android-iOS wrapper).
router.post('/mobile/register', auth, validate(fcmValidation.registerToken), fcmController.registerMobile);

// Remove a token. Body: { token, platform? }
router.delete('/unregister', auth, validate(fcmValidation.unregisterToken), fcmController.unregister);

// Send a test notification to the caller's own devices.
router.post('/test', auth, validate(fcmValidation.testNotification), fcmController.test);

module.exports = router;
