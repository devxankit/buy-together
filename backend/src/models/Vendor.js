const mongoose = require('mongoose');
const { VENDOR_STATUS, KYC_STATUS, BUSINESS_TYPES } = require('../utils/constants');

/**
 * Vendor
 * ------
 * Business profile for a seller on Buy Together. Independent of the User
 * collection — vendors are managed and approved by admins from the admin
 * console. `phone` is the unique business contact (also reserved as the
 * future OTP-login key) and is required at creation time.
 *
 * `status` drives the approval pipeline (pending → verified / rejected),
 * `kyc` tracks document verification (submitted → verified / failed).
 * `rating`, `dealsCount`, and `gmv` are running aggregates updated by the
 * deals/reviews pipelines (defaults at 0 until activity rolls in).
 */
const vendorSchema = mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },

    // 10-digit Indian mobile. Unique business contact / OTP-login key.
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'],
    },
    email: { type: String, trim: true, lowercase: true },

    category: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: Object.values(BUSINESS_TYPES),
      default: BUSINESS_TYPES.INDIVIDUAL,
    },
    gstNumber: { type: String, trim: true, uppercase: true },
    description: { type: String, trim: true },

    city: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    pincode: {
      type: String,
      trim: true,
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },

    website: { type: String, trim: true },
    logo: { type: String, trim: true },

    status: {
      type: String,
      enum: Object.values(VENDOR_STATUS),
      default: VENDOR_STATUS.PENDING,
    },
    kyc: {
      type: String,
      enum: Object.values(KYC_STATUS),
      default: KYC_STATUS.SUBMITTED,
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    dealsCount: { type: Number, default: 0, min: 0 },
    gmv: { type: Number, default: 0, min: 0 }, // in INR

    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/** True if some other vendor (besides excludeId) already uses this phone. */
vendorSchema.statics.isPhoneTaken = async function (phone, excludeId) {
  const v = await this.findOne({ phone, _id: { $ne: excludeId } });
  return !!v;
};

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
