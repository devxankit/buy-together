const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const authValidation = require('../validations/auth.validation');

const router = express.Router();

// ── User auth (mobile + OTP) ────────────────────────────────────────
router.post('/login', validate(authValidation.login), authController.login);
router.post('/send-otp', validate(authValidation.sendOtp), authController.sendOtp);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/verify-otp', validate(authValidation.verifyOtp), authController.verifyOtp);
router.post('/resend-otp', validate(authValidation.resendOtp), authController.resendOtp);

// ── Admin auth (email + password) ───────────────────────────────────
router.post('/admin/login', validate(authValidation.adminLogin), authController.adminLogin);

router.post('/logout', authController.logout);

module.exports = router;
