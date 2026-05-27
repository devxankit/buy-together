const httpStatus = require('http-status').status;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const otpService = require('./otp.service');
const { ROLES, USER_STATUS, OTP_PURPOSE } = require('../utils/constants');

/** Normalise any user-supplied phone to a bare 10-digit Indian number. */
const normalizePhone = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
};

const signToken = (user) => {
  const payload = { sub: user.id, role: user.role };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

/** Block suspended accounts from authenticating. */
const assertActive = (user) => {
  if (user.status === USER_STATUS.SUSPENDED) {
    throw new ApiError(httpStatus.FORBIDDEN, 'This account has been suspended. Contact support.');
  }
};

/**
 * Request an OTP for the login flow. Works for any valid number — if it isn't
 * registered yet, the account is created on successful verification (auto-signup).
 */
const requestLoginOtp = async (phoneRaw) => {
  const phone = normalizePhone(phoneRaw);
  const existing = await User.findOne({ phone });
  if (existing) assertActive(existing);
  const { devOtp } = await otpService.sendOtp(phone, OTP_PURPOSE.LOGIN);
  return { phone, isNewUser: !existing, devOtp };
};

/**
 * Begin signup: stash the supplied profile details and send a verification OTP.
 * If the phone already belongs to a verified account we reject so they log in
 * instead. The actual account is created/updated at verify time.
 */
const requestSignupOtp = async ({ name, phone: phoneRaw }) => {
  const phone = normalizePhone(phoneRaw);

  const existing = await User.findOne({ phone });
  if (existing && existing.isPhoneVerified) {
    throw new ApiError(httpStatus.CONFLICT, 'An account with this mobile number already exists. Please log in.');
  }

  // Create/refresh an unverified placeholder so the profile data survives the
  // round-trip to the OTP screen.
  if (existing) {
    existing.name = name || existing.name;
    await existing.save();
  } else {
    await User.create({ name, phone, isPhoneVerified: false });
  }

  const { devOtp } = await otpService.sendOtp(phone, OTP_PURPOSE.SIGNUP);
  return { phone, devOtp };
};

/**
 * Verify an OTP and return an authenticated session.
 * Auto-creates the account if the number has never been seen (login flow for a
 * new number). Requires name to enrich a freshly created profile.
 */
const verifyOtpAndAuth = async ({ phone: phoneRaw, otp, name }) => {
  const phone = normalizePhone(phoneRaw);

  await otpService.verifyOtp(phone, otp);

  let user = await User.findOne({ phone });
  if (!user) {
    if (!name || !name.trim()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name is required to complete registration.');
    }
    user = await User.create({
      name: name.trim(),
      phone,
      role: ROLES.USER,
      isPhoneVerified: true,
      status: USER_STATUS.ACTIVE,
      lastLoginAt: new Date(),
    });
  } else {
    assertActive(user);
    user.isPhoneVerified = true;
    user.lastLoginAt = new Date();
    if (name && !user.name) user.name = name.trim();
    await user.save();
  }

  const token = signToken(user);
  return { user, token };
};

/** Resend an OTP for whichever flow the client is in. */
const resendOtp = async (phoneRaw, purpose = OTP_PURPOSE.LOGIN) => {
  const phone = normalizePhone(phoneRaw);
  const { devOtp } = await otpService.sendOtp(phone, purpose);
  return { phone, devOtp };
};

/** Admin/console login via email + password. */
const loginAdminWithEmailAndPassword = async (email, password) => {
  const admin = await Admin.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!admin || !(await admin.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (admin.role !== ROLES.ADMIN) {
    throw new ApiError(httpStatus.FORBIDDEN, 'This account is not authorised for the admin console');
  }
  assertActive(admin);
  admin.lastLoginAt = new Date();
  await admin.save();
  const token = signToken(admin);
  return { user: admin, token };
};

module.exports = {
  normalizePhone,
  signToken,
  requestLoginOtp,
  requestSignupOtp,
  verifyOtpAndAuth,
  resendOtp,
  loginAdminWithEmailAndPassword,
};
