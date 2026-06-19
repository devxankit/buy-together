const httpStatus = require('http-status').status;
const User = require('../models/User');
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const Group = require('../models/Group');
const Setting = require('../models/Setting');
const firebase = require('../config/firebase');
const ApiError = require('../utils/ApiError');
const { normalizePhone } = require('./auth.service');
const { ROLES, USER_STATUS, VENDOR_STATUS, GROUP_STATUS, ADMIN_PERMISSIONS } = require('../utils/constants');

/** Keep only recognised permission keys. */
const sanitizePermissions = (perms) =>
  Array.isArray(perms) ? [...new Set(perms.filter((p) => ADMIN_PERMISSIONS.includes(p)))] : [];

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

/**
 * Ids of users with one-to-one chat activity. The Firebase `/conversations`
 * index holds an entry per user for every contact they've messaged (both sides
 * are written on send), so a user that appears here with ≥1 contact is "actively
 * chatting". Returns [] when Firebase isn't configured.
 */
const getChattingUserIds = async () => {
  if (!firebase.isConfigured()) return [];
  const snap = await firebase.getDatabase().ref('conversations').once('value');
  const val = snap.val();
  if (!val) return [];
  const ids = new Set();
  Object.keys(val).forEach((userId) => {
    const contacts = val[userId];
    if (contacts && Object.keys(contacts).length > 0 && OBJECT_ID_RE.test(userId)) {
      ids.add(userId);
    }
  });
  return [...ids];
};

/**
 * List users for the admin console with search + status/role filters and
 * pagination. Returns rows plus per-status counts for the summary tabs/strip.
 */
const queryUsers = async (filter = {}) => {
  const { search, status, role, activity, page = 1, limit = 20, sortBy = '-createdAt' } = filter;

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (role && role !== 'all') query.role = role;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: rx }, { email: rx }, { phone: rx }, { location: rx }];
  }

  // Group-membership + chat-activity are independent of status, and are also used
  // to drive the activity-filter counts, so resolve them up front.
  const roleMatch = role && role !== 'all' ? { role } : {};
  const [memberIds, chattingIds] = await Promise.all([
    Group.distinct('members'),
    getChattingUserIds(),
  ]);

  if (activity === 'ingroup') query._id = { $in: memberIds };
  else if (activity === 'nogroup') query._id = { $nin: memberIds };
  else if (activity === 'chatting') query._id = { $in: chattingIds };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Counts mirror the active role filter so a buyer-only view reports
  // buyer-only totals (and ignores any non-user docs in the collection).
  const countsMatch = {};
  if (role && role !== 'all') countsMatch.role = role;

  const [results, totalResults, counts, ingroupCount, chattingCount, roleTotal] = await Promise.all([
    User.find(query).sort(sortBy).skip(skip).limit(limitNum),
    User.countDocuments(query),
    User.aggregate([
      ...(Object.keys(countsMatch).length ? [{ $match: countsMatch }] : []),
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    User.countDocuments({ ...roleMatch, _id: { $in: memberIds } }),
    User.countDocuments({ ...roleMatch, _id: { $in: chattingIds } }),
    User.countDocuments(roleMatch),
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
    activityCounts: {
      all: roleTotal,
      ingroup: ingroupCount,
      nogroup: roleTotal - ingroupCount,
      chatting: chattingCount,
    },
  };
};

/**
 * Detailed buyer statistics for the admin Users dashboard. Combines:
 *  - account status (active/pending/flagged/suspended/verified),
 *  - growth (new signups today / this month),
 *  - activity based on `lastLoginAt` (daily / weekly / monthly active),
 *  - engagement: in a group, actively chatting (DM), and "highly active"
 *    (both in a group AND chatting).
 */
const getUserStats = async () => {
  const roleMatch = { role: ROLES.USER };
  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [memberIds, chattingIds] = await Promise.all([
    Group.distinct('members'),
    getChattingUserIds(),
  ]);

  const [
    total,
    active,
    pending,
    flagged,
    suspended,
    verified,
    newToday,
    newThisMonth,
    dau,
    wau,
    mau,
    inGroup,
    chatting,
    highlyActive,
  ] = await Promise.all([
    User.countDocuments(roleMatch),
    User.countDocuments({ ...roleMatch, status: USER_STATUS.ACTIVE }),
    User.countDocuments({ ...roleMatch, status: USER_STATUS.PENDING }),
    User.countDocuments({ ...roleMatch, status: USER_STATUS.FLAGGED }),
    User.countDocuments({ ...roleMatch, status: USER_STATUS.SUSPENDED }),
    User.countDocuments({ ...roleMatch, isPhoneVerified: true }),
    User.countDocuments({ ...roleMatch, createdAt: { $gte: startOfToday } }),
    User.countDocuments({ ...roleMatch, createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ ...roleMatch, lastLoginAt: { $gte: dayAgo } }),
    User.countDocuments({ ...roleMatch, lastLoginAt: { $gte: weekAgo } }),
    User.countDocuments({ ...roleMatch, lastLoginAt: { $gte: monthAgo } }),
    User.countDocuments({ ...roleMatch, _id: { $in: memberIds } }),
    User.countDocuments({ ...roleMatch, _id: { $in: chattingIds } }),
    User.countDocuments({ ...roleMatch, $and: [{ _id: { $in: memberIds } }, { _id: { $in: chattingIds } }] }),
  ]);

  return {
    total,
    active,
    pending,
    flagged,
    suspended,
    verified,
    newToday,
    newThisMonth,
    dau,
    wau,
    mau,
    inGroup,
    noGroup: total - inGroup,
    chatting,
    highlyActive,
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

/**
 * Dashboard counters for the admin console.
 * `vendors` is the total in the Vendor collection (not User.role==='vendor',
 * which has been deprecated in favour of the standalone Vendor model).
 * `pendingVendors` drives the red badge next to "Vendors" in the sidebar.
 */
const getStats = async () => {
  const [
    totalUsers,
    vendors,
    pendingVendors,
    admins,
    suspended,
    flagged,
    pending,
    totalGroups,
    activeGroups,
  ] = await Promise.all([
    User.countDocuments({}),
    Vendor.countDocuments({}),
    Vendor.countDocuments({ status: VENDOR_STATUS.PENDING }),
    Admin.countDocuments({}),
    User.countDocuments({ status: USER_STATUS.SUSPENDED }),
    User.countDocuments({ status: USER_STATUS.FLAGGED }),
    User.countDocuments({ status: USER_STATUS.PENDING }),
    Group.countDocuments({}),
    Group.countDocuments({ status: { $in: [GROUP_STATUS.ACTIVE, GROUP_STATUS.CLOSING] } }),
  ]);
  return { totalUsers, vendors, pendingVendors, admins, suspended, flagged, pending, totalGroups, activeGroups };
};

// ── Admin team management (super-admin only) ────────────────────────
const listAdmins = async () => Admin.find({}).sort({ isSuperAdmin: -1, createdAt: 1 });

const createAdmin = async (body) => {
  const email = String(body.email || '').toLowerCase().trim();
  if (await Admin.findOne({ email })) {
    throw new ApiError(httpStatus.CONFLICT, 'An admin with this email already exists');
  }
  const admin = await Admin.create({
    name: body.name,
    email,
    password: body.password,
    phone: body.phone ? normalizePhone(body.phone) : '',
    role: ROLES.ADMIN,
    status: body.status || USER_STATUS.ACTIVE,
    isSuperAdmin: !!body.isSuperAdmin,
    permissions: body.isSuperAdmin ? [] : sanitizePermissions(body.permissions),
  });
  return admin;
};

const countSuperAdmins = (excludeId) =>
  Admin.countDocuments({ isSuperAdmin: true, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });

const updateAdmin = async (id, body) => {
  const admin = await Admin.findById(id);
  if (!admin) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');

  if (body.email && body.email.toLowerCase() !== admin.email) {
    const email = body.email.toLowerCase().trim();
    if (await Admin.findOne({ email, _id: { $ne: admin._id } })) {
      throw new ApiError(httpStatus.CONFLICT, 'An admin with this email already exists');
    }
    admin.email = email;
  }

  if (body.name !== undefined) admin.name = body.name;
  if (body.phone !== undefined) admin.phone = body.phone ? normalizePhone(body.phone) : '';
  if (body.status !== undefined) admin.status = body.status;
  if (body.password) admin.password = body.password; // re-hashed by pre-save hook

  // Guard: never demote the last super admin.
  if (body.isSuperAdmin !== undefined && admin.isSuperAdmin && body.isSuperAdmin === false) {
    if ((await countSuperAdmins(admin._id)) === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'At least one super admin is required');
    }
  }
  if (body.isSuperAdmin !== undefined) admin.isSuperAdmin = !!body.isSuperAdmin;

  if (body.permissions !== undefined) admin.permissions = sanitizePermissions(body.permissions);
  if (admin.isSuperAdmin) admin.permissions = []; // super => everything, no explicit list

  await admin.save();
  return admin;
};

const deleteAdmin = async (id, requesterId) => {
  if (String(id) === String(requesterId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot remove your own admin account');
  }
  const admin = await Admin.findById(id);
  if (!admin) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  if (admin.isSuperAdmin && (await countSuperAdmins(admin._id)) === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'At least one super admin is required');
  }
  await admin.deleteOne();
  return admin;
};

const changeOwnPassword = async (adminId, currentPassword, newPassword) => {
  const admin = await Admin.findById(adminId).select('+password');
  if (!admin) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  if (!(await admin.isPasswordMatch(currentPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }
  admin.password = newPassword; // re-hashed by pre-save hook
  await admin.save();
  return { success: true };
};

// ── Platform settings (singleton) ───────────────────────────────────
const getSettings = async () => Setting.getSingleton();

const updateSettings = async (body) => {
  const settings = await Setting.getSingleton();
  ['platformName', 'supportEmail', 'contactNumber', 'contactNumberAlt', 'supportAddress'].forEach((k) => {
    if (body[k] !== undefined) settings[k] = body[k];
  });
  await settings.save();
  return settings;
};

module.exports = {
  queryUsers,
  getUserStats,
  getUserById,
  listAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeOwnPassword,
  getSettings,
  updateSettings,
  createUser,
  updateUserById,
  deleteUserById,
  getStats,
};
