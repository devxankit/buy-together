const httpStatus = require('http-status').status;
const Banner = require('../models/Banner');
const ApiError = require('../utils/ApiError');

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
const getActiveBanners = async () => {
  return Banner.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
};

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
  return Banner.create(body);
};

/**
 * Update banner by ID.
 */
const updateBannerById = async (id, body) => {
  const banner = await getBannerById(id);
  Object.assign(banner, body);
  await banner.save();
  return banner;
};

/**
 * Delete banner by ID.
 */
const deleteBannerById = async (id) => {
  const banner = await getBannerById(id);
  await banner.deleteOne();
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
