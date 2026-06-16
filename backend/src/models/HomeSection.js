const mongoose = require('mongoose');

/**
 * HomeSection
 * -----------
 * An admin-curated section on the consumer app home page (e.g. "Hot Buying
 * Groups", "Trending in Fashion", "Co-Own Properties & Spaces"). Admins decide
 * the heading (`title`), the visual treatment (`layout`), and exactly which
 * groups appear — picked individually and kept in the chosen order via the
 * `groups` array. Hidden sections (isActive=false) stay in the admin list but
 * are excluded from the public home feed.
 *
 * `layout` maps to the existing home-page UIs:
 *   - 'carousel' → horizontal scrollable card carousel (HotGroupsCarousel)
 *   - 'list'     → stacked vertical rows (ActiveGroupsList)
 */
const homeSectionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    layout: {
      type: String,
      enum: ['carousel', 'list'],
      default: 'carousel',
    },
    // Ordered list of groups shown in this section. Order here is the order
    // the cards render in on the home page.
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
      },
    ],
    // Optional destination for the section's "See All" affordance.
    viewAllLink: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Lower numbers render first on the home page.
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

const HomeSection = mongoose.model('HomeSection', homeSectionSchema);

module.exports = HomeSection;
