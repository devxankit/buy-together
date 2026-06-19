const mongoose = require('mongoose');
const { CONTENT_PAGE_SLUGS } = require('../utils/constants');

/**
 * ContentPage
 * -----------
 * Admin-editable content backing the consumer app's static screens — Help
 * Center, Terms & Conditions, Privacy Policy, Community Guidelines, and About
 * Us. Each page is keyed by a fixed `slug` and rendered from a uniform shape:
 * a heading, an optional intro/banner line, an optional "last updated" stamp,
 * an optional contact email, and an ordered list of `sections`.
 *
 * A `section` is intentionally generic so one model serves every page:
 *   - Terms / Privacy:        { title, body }                 (clause cards)
 *   - Community Guidelines:   { icon, title, body }           (rule cards)
 *   - Help Center:            { title (question), body (answer) }  (FAQ accordion)
 *   - About Us:               { icon, title, body }           (mission, steps…)
 */
const sectionSchema = mongoose.Schema(
  {
    // Optional leading emoji/glyph (used by Community Guidelines & About cards).
    icon: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    body: { type: String, trim: true, default: '' },
  },
  { _id: true }
);

const contentPageSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      enum: CONTENT_PAGE_SLUGS,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional intro paragraph rendered as a banner above the sections.
    intro: { type: String, trim: true, default: '' },
    // Free-text "Last updated: …" stamp (e.g. "May 2026").
    lastUpdated: { type: String, trim: true, default: '' },
    // Optional support/contact email surfaced on Help Center & About.
    contactEmail: { type: String, trim: true, default: '' },
    sections: [sectionSchema],
    isActive: {
      type: Boolean,
      default: true,
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

const ContentPage = mongoose.model('ContentPage', contentPageSchema);

module.exports = ContentPage;
