const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS, GENDERS } = require('../utils/constants');

/**
 * User
 * ----
 * Primary login identifier is the 10-digit Indian mobile number (OTP auth).
 * `email`/`password` are optional and only populated for admins (email+password
 * console login) or when a profile is enriched later. Profile + moderation
 * fields mirror what the admin Users console and the mobile profile screen use.
 */
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // 10-digit Indian mobile, stored without country code. Unique login key.
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    // Profile fields (mobile profile screen + admin table)
    avatar: { type: String, trim: true },
    gender: { type: String, enum: [...Object.values(GENDERS), null], default: null },
    dob: { type: Date },
    location: { type: String, trim: true },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

/** True if no other user (besides excludeUserId) already uses this email. */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  if (!email) return false;
  const user = await this.findOne({ email: email.toLowerCase(), _id: { $ne: excludeUserId } });
  return !!user;
};

/** True if no other user (besides excludeUserId) already uses this phone. */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};


const User = mongoose.model('User', userSchema);

module.exports = User;
