const mongoose = require('mongoose');

/**
 * Category
 * --------
 * Admin-managed taxonomy for demand groups (e.g. "Smartphones", "Cars & Bikes").
 * `slug` is the stable, URL-safe id the apps use to filter groups by category;
 * `image` is the cover used in the category carousel/cards. Hidden categories
 * (isActive=false) stay in the admin list but are excluded from public listings.
 */
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional lucide-react icon name shown alongside the label in the admin UI.
    icon: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // Hex accent used for chips/cards, e.g. "#0D9488".
    color: {
      type: String,
      trim: true,
      default: '',
    },
    // Lower numbers sort first in the carousel/list.
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subCategories: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

categorySchema.statics.isNameTaken = async function (name, excludeId) {
  const rx = new RegExp(`^${String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  const existing = await this.findOne({ name: rx, _id: { $ne: excludeId } });
  return !!existing;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
