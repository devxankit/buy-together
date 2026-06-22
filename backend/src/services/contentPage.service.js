const httpStatus = require('http-status').status;
const ContentPage = require('../models/ContentPage');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');
const { CONTENT_PAGE_SLUGS } = require('../utils/constants');

// Content pages (terms, privacy, about, …) are essentially static — cache each
// public page and bust it when an admin saves that slug.
const publicKey = (slug) => `contentPage:public:${slug}`;
const PUBLIC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── Public (consumer app) ───────────────────────────────────────────

// Active page by slug for the user app. Inactive/missing pages 404 so the app
// can fall back gracefully. Cached per slug.
const getPublicPage = async (slug) =>
  cache.wrap(publicKey(slug), PUBLIC_CACHE_TTL, async () => {
    const page = await ContentPage.findOne({ slug, isActive: true });
    if (!page) throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    return page;
  });

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
  cache.del(publicKey(slug));
  return page;
};

module.exports = {
  getPublicPage,
  listPagesAdmin,
  getPageBySlugAdmin,
  updatePageBySlug,
};
