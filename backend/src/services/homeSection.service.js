const httpStatus = require('http-status').status;
const HomeSection = require('../models/HomeSection');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');

// The public home feed is fetched on every home-page load and is a relatively
// expensive read (populates groups + their admins). It changes only when an
// admin edits sections, so cache it. TTL is short because the embedded groups
// carry live join counts — this bounds how stale those counts can look.
const ACTIVE_CACHE_KEY = 'homeSections:active';
const ACTIVE_CACHE_TTL = 60 * 1000; // 60 seconds

// Populate config for returning each section's groups ready for card display.
// Members stay as ids (their length powers the `spotsJoined` virtual).
const GROUP_POPULATE = {
  path: 'groups',
  populate: { path: 'admin', select: 'name' },
};

/**
 * Admin listing: all sections (active + hidden) with a search filter on the
 * title and a status counts breakdown for the summary tabs.
 */
const queryHomeSections = async (filter = {}) => {
  const { search, status } = filter;
  const query = {};

  if (status === 'active') query.isActive = true;
  if (status === 'hidden') query.isActive = false;

  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.title = rx;
  }

  const results = await HomeSection.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .populate(GROUP_POPULATE);

  const [all, active] = await Promise.all([
    HomeSection.countDocuments({}),
    HomeSection.countDocuments({ isActive: true }),
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
 * Public listing: active sections only, ordered for the home page, each with
 * its groups populated. Any groups that were since deleted are dropped.
 */
const getActiveHomeSections = async () =>
  cache.wrap(ACTIVE_CACHE_KEY, ACTIVE_CACHE_TTL, async () => {
    const sections = await HomeSection.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 })
      .populate(GROUP_POPULATE);

    // Strip dangling (deleted) group refs so the apps never render holes.
    return sections.map((section) => {
      const json = section.toJSON();
      json.groups = (json.groups || []).filter(Boolean);
      return json;
    });
  });

const getHomeSectionById = async (id) => {
  const section = await HomeSection.findById(id).populate(GROUP_POPULATE);
  if (!section) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home section not found');
  }
  return section;
};

const createHomeSection = async (body) => {
  const section = await HomeSection.create(body);
  cache.del(ACTIVE_CACHE_KEY);
  return getHomeSectionById(section.id);
};

const updateHomeSectionById = async (id, body) => {
  const section = await HomeSection.findById(id);
  if (!section) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home section not found');
  }
  Object.assign(section, body);
  await section.save();
  cache.del(ACTIVE_CACHE_KEY);
  return getHomeSectionById(id);
};

const deleteHomeSectionById = async (id) => {
  const section = await HomeSection.findById(id);
  if (!section) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home section not found');
  }
  await section.deleteOne();
  cache.del(ACTIVE_CACHE_KEY);
  return section;
};

module.exports = {
  queryHomeSections,
  getActiveHomeSections,
  getHomeSectionById,
  createHomeSection,
  updateHomeSectionById,
  deleteHomeSectionById,
};
