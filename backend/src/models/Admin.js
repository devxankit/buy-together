const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS } = require('../utils/constants');

const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN],
      default: ROLES.ADMIN,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    lastLoginAt: {
      type: Date,
    },
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

adminSchema.methods.isPasswordMatch = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// Async pre-hook (Mongoose 9 does not pass `next` to async hooks — just await).
adminSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
