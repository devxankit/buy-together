const mongoose = require('mongoose');

/**
 * Banner Model
 * ------------
 * Holds dynamic slider promotional banners shown on the user app dashboard home page.
 * titleLine1 and titleHighlight format the styled premium typography lines.
 * activeBuyers defaults to a mock stat if not specified.
 */
const bannerSchema = mongoose.Schema(
  {
    badge: {
      type: String,
      required: true,
      trim: true,
    },
    titleLine1: {
      type: String,
      required: true,
      trim: true,
    },
    titleHighlight: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    activeBuyers: {
      type: String,
      default: '1.5K+',
      trim: true,
    },
    link: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
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
        return ret;
      },
    },
  }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
