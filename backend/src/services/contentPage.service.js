const httpStatus = require('http-status').status;
const ContentPage = require('../models/ContentPage');
const ApiError = require('../utils/ApiError');
const { CONTENT_PAGE_SLUGS } = require('../utils/constants');

// ── Public (consumer app) ───────────────────────────────────────────

// Active page by slug for the user app. Inactive/missing pages 404 so the app
// can fall back gracefully.
const getPublicPage = async (slug) => {
  const page = await ContentPage.findOne({ slug, isActive: true });
  if (!page) throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  return page;
};

// ── Admin console ───────────────────────────────────────────────────

// All pages (active + hidden) for the editor, in the canonical slug order.
const listPagesAdmin = async () => {
  const pages = await ContentPage.find({});
  const order = CONTENT_PAGE_SLUGS;
  return pages.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
};

const getPageBySlugAdmin = async (slug) => {
  const page = await ContentPage.findOne({ slug });
  if (!page) throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
  return page;
};

/**
 * Upsert a page by slug. The set of pages is fixed (seeded), but upserting
 * makes the editor resilient — if a page was never seeded, the first save
 * creates it instead of 404ing.
 */
const updatePageBySlug = async (slug, body) => {
  if (!CONTENT_PAGE_SLUGS.includes(slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unknown content page');
  }
  const page = await ContentPage.findOneAndUpdate(
    { slug },
    { $set: { ...body, slug } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  return page;
};

module.exports = {
  getPublicPage,
  listPagesAdmin,
  getPageBySlugAdmin,
  updatePageBySlug,
};
