const httpStatus = require('http-status').status;
const User = require('../models/User');
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const { normalizePhone } = require('./auth.service');
const { ROLES, USER_STATUS } = require('../utils/constants');

/**
 * List users for the admin console with search + status/role filters and
 * pagination. Returns rows plus per-status counts for the summary tabs/strip.
 */
const queryUsers = async (filter = {}) => {
  const { search, status, role, page = 1, limit = 20, sortBy = '-createdAt' } = filter;

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (role && role !== 'all') query.role = role;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: rx }, { email: rx }, { phone: rx }, { location: rx }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Counts mirror the active role filter so a buyer-only view reports
  // buyer-only totals (and ignores any non-user docs in the collection).
  const countsMatch = {};
  if (role && role !== 'all') countsMatch.role = role;

  const [results, totalResults, counts] = await Promise.all([
    User.find(query).sort(sortBy).skip(skip).limit(limitNum),
    User.countDocuments(query),
    User.aggregate([
      ...(Object.keys(countsMatch).length ? [{ $match: countsMatch }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const statusCounts = Object.values(USER_STATUS).reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  let all = 0;
  counts.forEach(({ _id, count }) => {
    if (_id in statusCounts) statusCounts[_id] = count;
    all += count;
  });

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum) || 1,
    totalResults,
    counts: { all, ...statusCounts },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

/**
 * Admin creates a user. OTP-only model => no password is set. The account is
 * created active and (optionally) marked phone-verified so it can log in
 * immediately via OTP.
 */
const createUser = async (body) => {
  const phone = normalizePhone(body.phone);

  if (await User.isPhoneTaken(phone)) {
    throw new ApiError(httpStatus.CONFLICT, 'A user with this mobile number already exists');
  }
  if (body.email && (await User.isEmailTaken(body.email))) {
    throw new ApiError(httpStatus.CONFLICT, 'This email is already in use');
  }

  return User.create({
    name: body.name,
    phone,
    email: body.email || undefined,
    role: body.role || ROLES.USER,
    status: body.status || USER_STATUS.ACTIVE,
    location: body.location,
    dob: body.dob,
    avatar: body.avatar,
    isPhoneVerified: body.isPhoneVerified ?? true,
  });
};

const updateUserById = async (id, body) => {
  const user = await getUserById(id);

  if (body.phone) {
    const phone = normalizePhone(body.phone);
    if (phone !== user.phone && (await User.isPhoneTaken(phone, user._id))) {
      throw new ApiError(httpStatus.CONFLICT, 'A user with this mobile number already exists');
    }
    body.phone = phone;
  }
  if (body.email && (await User.isEmailTaken(body.email, user._id))) {
    throw new ApiError(httpStatus.CONFLICT, 'This email is already in use');
  }

  Object.assign(user, body);
  await user.save();
  return user;
};

const deleteUserById = async (id) => {
  const user = await getUserById(id);
  await user.deleteOne();
  return user;
};

/** Dashboard counters for the admin console. */
const getStats = async () => {
  const [totalUsers, vendors, admins, suspended, flagged, pending] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: ROLES.VENDOR }),
    Admin.countDocuments({}),
    User.countDocuments({ status: USER_STATUS.SUSPENDED }),
    User.countDocuments({ status: USER_STATUS.FLAGGED }),
    User.countDocuments({ status: USER_STATUS.PENDING }),
  ]);
  return { totalUsers, vendors, admins, suspended, flagged, pending };
};

module.exports = {
  queryUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getStats,
};
