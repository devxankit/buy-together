const mongoose = require('mongoose');

const dealSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    originalPrice: Number,
    discountedPrice: Number,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
