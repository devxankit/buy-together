const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { OTP_PURPOSE } = require('../utils/constants');

/**
 * Otp
 * ---
 * One document per OTP issued. The code itself is never stored in clear text —
 * only a bcrypt hash. Documents auto-expire via a TTL index on `expiresAt`, so
 * stale/used codes clean themselves up. `attempts` caps brute-force guessing.
 */
const otpSchema = mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: Object.values(OTP_PURPOSE),
      default: OTP_PURPOSE.LOGIN,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    consumed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL index: Mongo removes the doc once expiresAt passes.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.methods.isCodeMatch = async function (code) {
  return bcrypt.compare(String(code), this.codeHash);
};

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
