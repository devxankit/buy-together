const httpStatus = require('http-status').status;
const Group = require('../models/Group');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { GROUP_STATUS } = require('../utils/constants');

// ── User-facing (consumer app) ──────────────────────────────────────

const createGroup = async (groupBody) => {
  // The consumer app historically posted `name`; the model now uses `title`.
  const { name, ...rest } = groupBody;
  return Group.create({ ...rest, title: rest.title || name });
};

const queryGroups = async (userId, filter = {}) => {
  const query = {};
  if (filter.joined === 'true') {
    query.members = userId;
  }
  if (filter.created === 'true') {
    query.admin = userId;
  }
  if (filter.category && filter.category !== 'all') {
    query.category = filter.category;
  }
  return Group.find(query).populate('members', 'name email').populate('admin', 'name');
};

const getGroupById = async (id) => {
  return Group.findById(id)
    .populate('members', 'name phone email avatar status')
    .populate('admin', 'name phone');
};

// ── Admin console ───────────────────────────────────────────────────

/**
 * Admin group listing with search, status tabs, category filter, pagination,
 * and a counts breakdown for the summary tabs. The `locked` tab folds in
 * `completed` groups to mirror the console UI.
 */
const queryGroupsAdmin = async (filter = {}) => {
  const { search, status, category, page = 1, limit = 20, sortBy = '-createdAt' } = filter;

  const query = {};
  if (status && status !== 'all') {
    query.status =
      status === 'locked'
        ? { $in: [GROUP_STATUS.LOCKED, GROUP_STATUS.COMPLETED] }
        : status;
  }
  if (category && category !== 'all') query.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ title: rx }, { category: rx }, { location: rx }, { creatorName: rx }, { slogan: rx }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [results, totalResults, counts] = await Promise.all([
    Group.find(query).sort(sortBy).skip(skip).limit(limitNum).populate('admin', 'name'),
    Group.countDocuments(query),
    Group.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const raw = {};
  let all = 0;
  counts.forEach(({ _id, count }) => {
    raw[_id] = count;
    all += count;
  });

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum) || 1,
    totalResults,
    counts: {
      all,
      active: raw[GROUP_STATUS.ACTIVE] || 0,
      closing: raw[GROUP_STATUS.CLOSING] || 0,
      locked: (raw[GROUP_STATUS.LOCKED] || 0) + (raw[GROUP_STATUS.COMPLETED] || 0),
      flagged: raw[GROUP_STATUS.FLAGGED] || 0,
    },
  };
};

const getGroupByIdAdmin = async (id) => {
  const group = await Group.findById(id)
    .populate('members', 'name phone email avatar status')
    .populate('admin', 'name phone');
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, 'Group not found');
  return group;
};

const createGroupAdmin = async (body) => {
  return Group.create({
    title: body.title,
    productName: body.productName,
    description: body.description,
    slogan: body.slogan,
    category: body.category,
    subCategory: body.subCategory,
    type: body.type,
    location: body.location,
    image: body.image,
    spotsTotal: body.spotsTotal,
    creatorName: body.creatorName,
    status: body.status,
    closesAt: body.closesAt,
    members: body.members || [],
  });
};

const updateGroupByIdAdmin = async (id, body) => {
  const group = await getGroupByIdAdmin(id);
  Object.assign(group, body);
  await group.save();
  return getGroupByIdAdmin(id);
};

const deleteGroupByIdAdmin = async (id) => {
  const group = await getGroupByIdAdmin(id);
  await group.deleteOne();
  return group;
};

/** Add a user to the group's members (idempotent). */
const addMember = async (groupId, userId) => {
  const group = await getGroupByIdAdmin(groupId);

  const user = await User.findById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  if (group.members.some((m) => String(m._id || m) === String(userId))) {
    throw new ApiError(httpStatus.CONFLICT, 'User is already a member of this group');
  }

  await Group.updateOne({ _id: groupId }, { $addToSet: { members: userId } });
  return getGroupByIdAdmin(groupId);
};

/** Remove a user from the group's members. */
const removeMember = async (groupId, userId) => {
  await getGroupByIdAdmin(groupId);
  await Group.updateOne({ _id: groupId }, { $pull: { members: userId } });
  return getGroupByIdAdmin(groupId);
};

module.exports = {
  createGroup,
  queryGroups,
  getGroupById,
  queryGroupsAdmin,
  getGroupByIdAdmin,
  createGroupAdmin,
  updateGroupByIdAdmin,
  deleteGroupByIdAdmin,
  addMember,
  removeMember,
};
