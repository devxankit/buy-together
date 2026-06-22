const httpStatus = require('http-status').status;
const Category = require('../models/Category');
const Group = require('../models/Group');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');

// Public active-categories list is read on nearly every app screen but changes
// only when an admin edits the taxonomy — cache it briefly and bust on writes.
const ACTIVE_CACHE_KEY = 'categories:active';
const ACTIVE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/** Turn "Cars & Bikes" into "cars-bikes". */
const slugify = (name) =>
  String(name)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Generate a slug from name that is unique (appends -2, -3, … on collision). */
const generateUniqueSlug = async (name, excludeId) => {
  const base = slugify(name) || 'category';
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await Category.findOne({ slug, _id: { $ne: excludeId } })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
};

/** Map slug → number of groups, so the admin list can show usage. */
const getGroupCounts = async () => {
  const rows = await Group.aggregate([
    { $match: { category: { $ne: null } } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  return rows.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
};

/**
 * Admin listing: every category (active + hidden), with a `groupCount`, plus
 * status counts for the summary tabs.
 */
const queryCategories = async (filter = {}) => {
  const { search, status } = filter;
  const query = {};
  if (status === 'active') query.isActive = true;
  if (status === 'hidden') query.isActive = false;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: rx }, { slug: rx }, { description: rx }];
  }

  const [categories, counts] = await Promise.all([
    Category.find(query).sort({ displayOrder: 1, name: 1 }),
    getGroupCounts(),
  ]);

  const results = categories.map((c) => ({
    ...c.toObject(),
    groupCount: (counts[c.name] || 0) + (counts[c.slug] || 0),
  }));

  const [all, active] = await Promise.all([
    Category.countDocuments({}),
    Category.countDocuments({ isActive: true }),
  ]);

  return { results, counts: { all, active, hidden: all - active } };
};

/** Public listing: active categories only, ordered for display. Cached. */
const getActiveCategories = async () =>
  cache.wrap(ACTIVE_CACHE_KEY, ACTIVE_CACHE_TTL, () =>
    Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 })
  );

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  return category;
};

const createCategory = async (body) => {
  if (await Category.isNameTaken(body.name)) {
    throw new ApiError(httpStatus.CONFLICT, 'A category with this name already exists');
  }
  const slug = body.slug ? slugify(body.slug) : await generateUniqueSlug(body.name);
  const created = await Category.create({ ...body, slug });
  cache.del(ACTIVE_CACHE_KEY);
  return created;
};

const updateCategoryById = async (id, body) => {
  const category = await getCategoryById(id);

  if (body.name && (await Category.isNameTaken(body.name, category._id))) {
    throw new ApiError(httpStatus.CONFLICT, 'A category with this name already exists');
  }
  // Keep the slug in sync if the name changes and no explicit slug was given.
  if (body.name && !body.slug && body.name !== category.name) {
    body.slug = await generateUniqueSlug(body.name, category._id);
  } else if (body.slug) {
    body.slug = await generateUniqueSlug(body.slug, category._id);
  }

  Object.assign(category, body);
  await category.save();
  cache.del(ACTIVE_CACHE_KEY);
  return category;
};

const deleteCategoryById = async (id) => {
  const category = await getCategoryById(id);
  await category.deleteOne();
  cache.del(ACTIVE_CACHE_KEY);
  return category;
};

module.exports = {
  slugify,
  queryCategories,
  getActiveCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
