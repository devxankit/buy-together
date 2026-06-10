const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status').status;
const Otp = require('../models/Otp');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const { sendSms } = require('../integrations/sms');
const { OTP_PURPOSE } = require('../utils/constants');

const normalizePhone = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
};

/** Cryptographically-random numeric code of the configured length. */
const generateCode = () => {
  const { length } = config.otp;
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(length, '0');
};

const buildMessage = (code) =>
  config.otp.smsTemplate
    .replace('{brand}', config.otp.brandName)
    .replace('{otp}', code)
    .replace('{mins}', String(config.otp.expiryMinutes));

/**
 * Issue an OTP for a phone number: enforces a resend cooldown, invalidates any
 * prior live codes, stores a hash of the new code, and dispatches the SMS.
 *
 * Returns `{ devOtp }` where devOtp is the plain code ONLY when OTP_LIVE=false
 * (so the dev flow can surface it); it is null in live mode.
 */
const sendOtp = async (phone, purpose = OTP_PURPOSE.LOGIN) => {
  const testPhone = config.otp.testPhone ? normalizePhone(config.otp.testPhone) : '';
  const testOtp = config.otp.testOtp;

  if (testPhone && phone === testPhone && testOtp) {
    // If it's the test phone, invalidate prior codes and create a matching one in the DB
    await Otp.updateMany({ phone, consumed: false }, { consumed: true });
    const codeHash = await bcrypt.hash(testOtp, 10);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);
    await Otp.create({ phone, codeHash, purpose, expiresAt });
    console.log(`[sendOtp] Bypassed SMS sending for test phone ${phone}`);
    return { devOtp: testOtp };
  }

  const cooldownMs = config.otp.resendCooldownSeconds * 1000;
  if (cooldownMs > 0) {
    const recent = await Otp.findOne({ phone, consumed: false }).sort({ createdAt: -1 });
    if (recent && Date.now() - recent.createdAt.getTime() < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - (Date.now() - recent.createdAt.getTime())) / 1000);
      throw new ApiError(
        httpStatus.TOO_MANY_REQUESTS,
        `Please wait ${waitSec}s before requesting another OTP`
      );
    }
  }

  // Invalidate any outstanding codes so only the newest one is valid.
  await Otp.updateMany({ phone, consumed: false }, { consumed: true });

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

  console.log(`[DEBUG sendOtp] code: ${code}, hash: ${codeHash}`);
  console.log(`[DEBUG sendOtp] compare: ${await bcrypt.compare(code, codeHash)}`);
  await Otp.create({ phone, codeHash, purpose, expiresAt });

  await sendSms(phone, buildMessage(code));

  // Surface the code only when SMS isn't actually being delivered (dev/testing).
  return { devOtp: config.sms.enabled ? null : code };
};

/**
 * Verify a submitted code against the newest live OTP for the phone.
 * Consumes the OTP on success; counts failures toward the attempt cap.
 * Throws ApiError on any failure; resolves silently on success.
 */
const verifyOtp = async (phone, code) => {
  const testPhone = config.otp.testPhone ? normalizePhone(config.otp.testPhone) : '';
  const testOtp = config.otp.testOtp;

  if (testPhone && testOtp && phone === testPhone && String(code) === String(testOtp)) {
    // Bypass verification and consume any active test OTP records
    await Otp.updateMany({ phone, consumed: false }, { consumed: true });
    console.log(`[verifyOtp] Bypassed DB check for test phone ${phone} with test OTP`);
    return;
  }

  const otp = await Otp.findOne({ phone, consumed: false }).sort({ createdAt: -1 });

  if (!otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No active OTP found. Please request a new one.');
  }

  if (otp.expiresAt.getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'OTP has expired. Please request a new one.');
  }

  if (otp.attempts >= config.otp.maxAttempts) {
    otp.consumed = true;
    await otp.save();
    throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many incorrect attempts. Please request a new OTP.');
  }

  const match = await otp.isCodeMatch(code);
  console.log(`[DEBUG verifyOtp] phone: ${phone}, code: ${JSON.stringify(code)} (type: ${typeof code}), database purpose: ${otp.purpose}, hash: ${otp.codeHash}, match: ${match}`);
  if (!match) {
    otp.attempts += 1;
    await otp.save();
    const left = Math.max(0, config.otp.maxAttempts - otp.attempts);
    throw new ApiError(httpStatus.BAD_REQUEST, `Incorrect OTP. ${left} attempt(s) left.`);
  }

  otp.consumed = true;
  await otp.save();
};

module.exports = {
  sendOtp,
  verifyOtp,
  generateCode,
};
