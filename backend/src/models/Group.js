const mongoose = require('mongoose');
const { GROUP_STATUS, GROUP_TYPE } = require('../utils/constants');

/**
 * Group
 * -----
 * A demand pool: buyers (or a vendor) band together to hit a target headcount
 * and unlock a bulk price. Fully managed by admins from the console — they can
 * create groups, edit them, move them through the lifecycle, and add/remove
 * members at will.
 *
 * `spotsTotal` is the target size; the live "joined" count is simply
 * `members.length` (exposed as `spotsJoined` in JSON). `closesAt` drives the
 * "days left" countdown. `admin` links to the owning platform user when the
 * group originated in the consumer app; `creatorName` carries a display name
 * for groups an admin spins up directly.
 */
const groupSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slogan: {
      type: String,
      trim: true,
    },
    // The specific product/model the group is pooling demand for.
    productName: {
      type: String,
      trim: true,
    },
    // Slug/name of the Category this group belongs to (see Category model).
    category: {
      type: String,
      trim: true,
      index: true,
    },
    // Finer classification under `category` (e.g. "iPhone" under "Smartphones").
    subCategory: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(GROUP_TYPE),
      default: GROUP_TYPE.USER,
    },
    location: {
      type: String,
      trim: true,
    },
    // Pinpoint coordinates for the group's location, used to sort groups by
    // distance from the user on the Explore page. Captured by the admin when
    // picking a place from Google autocomplete. Null when unknown.
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    image: {
      type: String,
      trim: true,
    },
    // Target headcount needed to lock the deal.
    spotsTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Owning platform user (optional — admin-created groups may have none).
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Display name of the creator for groups not tied to a platform user.
    creatorName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(GROUP_STATUS),
      default: GROUP_STATUS.ACTIVE,
    },
    // Admin-controlled flag: when true, the group appears in the consumer app's
    // "Trending Right Now" carousel on the Groups page. Curated entirely from
    // the admin Groups console.
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Deadline by which the group must fill — powers the countdown display.
    closesAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;

        // Live joined count from the members array (populated or raw ids).
        ret.spotsJoined = Array.isArray(ret.members) ? ret.members.length : 0;

        // Creator display name: explicit override → owning user → dash.
        ret.creator =
          ret.creatorName || (ret.admin && ret.admin.name) || '—';

        // Human "Nd left" countdown derived from the deadline.
        if (ret.closesAt) {
          const days = Math.max(0, Math.ceil((new Date(ret.closesAt) - Date.now()) / 86400000));
          ret.daysLeft = `${days}d left`;
        } else {
          ret.daysLeft = '—';
        }

        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes backing the common query/sort paths:
//  - status + createdAt: admin listing filters by status and sorts by -createdAt
//  - members: user-facing "joined" lookups (query.members = userId)
//  - admin: user-facing "created by me" lookups (query.admin = userId)
groupSchema.index({ status: 1, createdAt: -1 });
groupSchema.index({ members: 1 });
groupSchema.index({ admin: 1 });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
