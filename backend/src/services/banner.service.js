const httpStatus = require('http-status').status;
const Banner = require('../models/Banner');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');

// The public active-banners carousel loads on every home-page visit but changes
// only when an admin edits banners — cache it briefly and bust on writes.
const ACTIVE_CACHE_KEY = 'banners:active';
const ACTIVE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Admin listing: query all banners (active + hidden) with search filter and pagination-like counts.
 */
const queryBanners = async (filter = {}) => {
  const { search, status } = filter;
  const query = {};

  if (status === 'active') query.isActive = true;
  if (status === 'hidden') query.isActive = false;

  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { badge: rx },
      { titleLine1: rx },
      { titleHighlight: rx },
      { description: rx }
    ];
  }

  const results = await Banner.find(query).sort({ displayOrder: 1, createdAt: -1 });

  const [all, active] = await Promise.all([
    Banner.countDocuments({}),
    Banner.countDocuments({ isActive: true }),
  ]);

  return {
    results,
    counts: {
      all,
      active,
      hidden: all - active,
    },
  };
};

/**
 * Public listing: Active banners only, ordered for carousel display.
 */
const getActiveBanners = async () =>
  cache.wrap(ACTIVE_CACHE_KEY, ACTIVE_CACHE_TTL, () =>
    Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 }).lean()
  );

/**
 * Get banner by ID.
 */
const getBannerById = async (id) => {
  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Banner not found');
  }
  return banner;
};

/**
 * Create new banner.
 */
const createBanner = async (body) => {
  if (body.displayOrder !== undefined && body.displayOrder !== null) {
    const existingOrder = await Banner.findOne({ displayOrder: body.displayOrder });
    if (existingOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This display order is already assigned to another banner. Please choose a unique display order.');
    }
  }
  const banner = await Banner.create(body);
  cache.del(ACTIVE_CACHE_KEY);
  return banner;
};

/**
 * Update banner by ID.
 */
const updateBannerById = async (id, body) => {
  const banner = await getBannerById(id);
  if (body.displayOrder !== undefined && body.displayOrder !== null && body.displayOrder !== banner.displayOrder) {
    const existingOrder = await Banner.findOne({ displayOrder: body.displayOrder, _id: { $ne: banner._id } });
    if (existingOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This display order is already assigned to another banner. Please choose a unique display order.');
    }
  }
  Object.assign(banner, body);
  await banner.save();
  cache.del(ACTIVE_CACHE_KEY);
  return banner;
};

/**
 * Delete banner by ID.
 */
const deleteBannerById = async (id) => {
  const banner = await getBannerById(id);
  await banner.deleteOne();
  cache.del(ACTIVE_CACHE_KEY);
  return banner;
};

module.exports = {
  queryBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBannerById,
  deleteBannerById,
};
