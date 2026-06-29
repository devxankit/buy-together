const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const authValidation = require('../validations/auth.validation');
const { otpSendLimiter, otpVerifyLimiter, loginLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// ── User auth (mobile + OTP) ────────────────────────────────────────
// Rate-limited: OTP sends/verifies by phone, logins by IP (see middleware).
router.post('/login', loginLimiter, validate(authValidation.login), authController.login);
router.post('/send-otp', otpSendLimiter, validate(authValidation.sendOtp), authController.sendOtp);
router.post('/register', otpVerifyLimiter, validate(authValidation.register), authController.register);
router.post('/verify-otp', otpVerifyLimiter, validate(authValidation.verifyOtp), authController.verifyOtp);
router.post('/resend-otp', otpSendLimiter, validate(authValidation.resendOtp), authController.resendOtp);

// ── Admin auth (email + password) ───────────────────────────────────
router.post('/admin/login', loginLimiter, validate(authValidation.adminLogin), authController.adminLogin);

router.post('/logout', authController.logout);

module.exports = router;
