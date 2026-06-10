const joi = require('joi');
const { OTP_PURPOSE } = require('../utils/constants');

// Accepts "9876543210", "+91 9876543210", "09876543210" etc. — normalised in the service.
const phone = joi
  .string()
  .pattern(/^(\+?91[\-\s]?)?[0]?[6-9]\d{9}$/)
  .messages({ 'string.pattern.base': 'Enter a valid 10-digit Indian mobile number' });

const otpCode = joi
  .string()
  .pattern(/^\d{4,8}$/)
  .messages({ 'string.pattern.base': 'OTP must be 4–8 digits' });

const login = {
  body: joi.object().keys({
    phone: phone.required(),
  }),
};

const sendOtp = login;

const register = {
  body: joi.object().keys({
    name: joi.string().trim().min(2).max(80).required(),
    phone: phone.required(),
  }),
};

const verifyOtp = {
  body: joi.object().keys({
    phone: phone.required(),
    otp: otpCode.required(),
    name: joi.string().trim().min(2).max(80),
  }),
};

const resendOtp = {
  body: joi.object().keys({
    phone: phone.required(),
    purpose: joi.string().valid(...Object.values(OTP_PURPOSE)),
  }),
};

const adminLogin = {
  body: joi.object().keys({
    email: joi.string().email({ tlds: false }).required(),
    password: joi.string().required(),
  }),
};

module.exports = {
  login,
  sendOtp,
  register,
  verifyOtp,
  resendOtp,
  adminLogin,
};
