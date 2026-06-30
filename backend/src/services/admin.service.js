const httpStatus = require('http-status').status;
const User = require('../models/User');
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const Group = require('../models/Group');
const Setting = require('../models/Setting');
const firebase = require('../config/firebase');
const ticketService = require('./ticket.service');
const ApiError = require('../utils/ApiError');
const cache = require('../utils/cache');
const authCache = require('../utils/authCache');
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

// These two feed the admin Users list + stats and are independently expensive:
// `Group.distinct('members')` scans the whole groups collection and returns an
// ever-growing id array, and `getChattingUserIds` pulls the entire Firebase
// conversations tree. Both change slowly relative to how often the admin pages
// poll, so cache them briefly (counts may lag real-time by up to the TTL).
const SIGNALS_TTL = 30 * 1000; // 30 seconds
const getMemberIdsCached = () => cache.wrap('admin:memberIds', SIGNALS_TTL, () => Group.distinct('members'));
const getChattingUserIdsCached = () => cache.wrap('admin:chattingIds', SIGNALS_TTL, getChattingUserIds);

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
    getMemberIdsCached(),
    getChattingUserIdsCached(),
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
    getMemberIdsCached(),
    getChattingUserIdsCached(),
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
  authCache.bustUser(id); // suspend/status/profile change must not be served stale
  return user;
};

const deleteUserById = async (id) => {
  const user = await getUserById(id);
  await user.deleteOne();
  authCache.bustUser(id);
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
    openTickets,
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
    ticketService.countOpenTickets(),
  ]);
  return { totalUsers, vendors, pendingVendors, admins, suspended, flagged, pending, totalGroups, activeGroups, openTickets };
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
  authCache.bustAdmin(id); // role/status/permission change must not be served stale
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
  authCache.bustAdmin(id);
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
  [
    'platformName', 'supportEmail', 'contactNumber', 'contactNumberAlt', 'supportAddress',
    'liveStatsActiveGroups', 'liveStatsActiveGroupsTrend',
    'liveStatsPeopleInterested', 'liveStatsPeopleInterestedTrend',
    'liveStatsGroupsGrowing', 'liveStatsGroupsGrowingTrend',
    'liveStatsTopCity', 'liveStatsTopCityTrend'
  ].forEach((k) => {
    if (body[k] !== undefined) settings[k] = body[k];
  });
  await settings.save();
  return settings;
};

// ── Dashboard (live platform intelligence) ──────────────────────────
// Backs the admin Dashboard's KPI cards, charts, top-regions and activity
// feed with real data instead of static mock values. Heavy-ish (several
// aggregations) but cached briefly since it's polled, not hit per-keystroke.

const ACCENT_BY_INDEX = ['primary', 'violet', 'info', 'amber', 'danger'];
const DONUT_COLORS = ['#0D9488', '#6D5BD0', '#2C5680', '#D08700', '#D14343', '#0B7A70'];

// 12-month [{ y, m(0-11), label }] window ending with the current month.
const lastTwelveMonths = () => {
  const out = [];
  const base = new Date();
  base.setDate(1);
  base.setHours(0, 0, 0, 0);
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
    out.push({ y: d.getFullYear(), m: d.getMonth(), label: d.toLocaleString('en-US', { month: 'short' }) });
  }
  return out;
};

// Monthly document counts over the last 12 months → [{ m: 'Jun', value }].
const monthlySeries = async (Model, match = {}) => {
  const months = lastTwelveMonths();
  const start = new Date(months[0].y, months[0].m, 1);
  const rows = await Model.aggregate([
    { $match: { ...match, createdAt: { $gte: start } } },
    { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
  ]);
  const map = {};
  rows.forEach((r) => { map[`${r._id.y}-${r._id.m}`] = r.count; });
  // $month is 1-based; JS month is 0-based.
  return months.map((mb) => ({ m: mb.label, value: map[`${mb.y}-${mb.m + 1}`] || 0 }));
};

// Percent change of the last point vs the previous one in a value series.
const seriesDelta = (series) => {
  if (!series || series.length < 2) return { delta: 0, trend: 'up' };
  const cur = series[series.length - 1].value;
  const prev = series[series.length - 2].value;
  if (prev === 0) return { delta: cur > 0 ? 100 : 0, trend: cur >= 0 ? 'up' : 'down' };
  const pct = ((cur - prev) / prev) * 100;
  return { delta: Math.round(Math.abs(pct) * 10) / 10, trend: cur >= prev ? 'up' : 'down' };
};

const getDashboardData = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeGroups,
    totalGroups,
    totalVendors,
    pendingVendors,
    openTickets,
    flaggedUsers,
    userSeries,
    groupSeries,
    vendorSeries,
    categoryAgg,
    regionAgg,
    recentGroups,
    recentVendors,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.USER }),
    Group.countDocuments({ status: { $in: [GROUP_STATUS.ACTIVE, GROUP_STATUS.CLOSING] } }),
    Group.countDocuments({}),
    Vendor.countDocuments({}),
    Vendor.countDocuments({ status: VENDOR_STATUS.PENDING }),
    ticketService.countOpenTickets(),
    User.countDocuments({ role: ROLES.USER, status: USER_STATUS.FLAGGED }),
    monthlySeries(User, { role: ROLES.USER }),
    monthlySeries(Group),
    monthlySeries(Vendor),
    Group.aggregate([
      { $match: { category: { $nin: [null, ''] } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Group.aggregate([
      { $match: { location: { $nin: [null, ''] } } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          thisMonth: { $sum: { $cond: [{ $gte: ['$createdAt', startOfMonth] }, 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Group.find({}).sort({ createdAt: -1 }).limit(6).select('title productName category location createdAt'),
    Vendor.find({}).sort({ createdAt: -1 }).limit(6).select('businessName category city status createdAt'),
    User.find({ role: ROLES.USER }).sort({ createdAt: -1 }).limit(6).select('name location createdAt'),
  ]);

  // ── KPI cards ──────────────────────────────────────────────────
  const usersDelta = seriesDelta(userSeries);
  const groupsDelta = seriesDelta(groupSeries);
  const vendorsDelta = seriesDelta(vendorSeries);
  const spark = (s) => s.map((p) => p.value);

  const kpis = [
    { id: 'users', label: 'Total Users', value: totalUsers, prefix: '', delta: usersDelta.delta, trend: usersDelta.trend, spark: spark(userSeries), icon: 'Users', accent: 'primary' },
    { id: 'groups', label: 'Active Groups', value: activeGroups, prefix: '', delta: groupsDelta.delta, trend: groupsDelta.trend, spark: spark(groupSeries), icon: 'Boxes', accent: 'violet' },
    { id: 'vendors', label: 'Total Vendors', value: totalVendors, prefix: '', delta: vendorsDelta.delta, trend: vendorsDelta.trend, spark: spark(vendorSeries), icon: 'Store', accent: 'info' },
    { id: 'pending', label: 'Pending Approvals', value: pendingVendors, prefix: '', delta: 0, trend: pendingVendors > 0 ? 'down' : 'up', spark: spark(vendorSeries), icon: 'ClockAlert', accent: 'amber' },
  ];

  // ── Category demand (donut) ────────────────────────────────────
  const catTotal = categoryAgg.reduce((sum, c) => sum + c.count, 0) || 1;
  const categoryDemand = categoryAgg.map((c, i) => ({
    label: c._id,
    value: Math.round((c.count / catTotal) * 100),
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  // ── Top regions (data-driven — no hard-coded city list) ────────
  const maxRegion = regionAgg.reduce((mx, r) => Math.max(mx, r.count), 0) || 1;
  const topRegions = regionAgg.map((r) => ({
    region: r._id,
    count: r.count,
    demand: Math.max(8, Math.round((r.count / maxRegion) * 100)),
    growth: r.thisMonth > 0 ? `+${r.thisMonth} this mo` : 'steady',
  }));

  // ── Recent activity (real events, newest first) ────────────────
  const events = [];
  recentGroups.forEach((g) => events.push({
    id: `g-${g._id}`, type: 'group', title: 'New group created',
    detail: g.title || g.productName || 'Untitled group', at: g.createdAt, icon: 'Boxes', accent: 'primary',
  }));
  recentVendors.forEach((v) => events.push({
    id: `v-${v._id}`, type: 'vendor',
    title: v.status === VENDOR_STATUS.PENDING ? 'Vendor awaiting review' : 'Vendor onboarded',
    detail: `${v.businessName}${v.city ? ` · ${v.city}` : ''}`, at: v.createdAt, icon: 'Store', accent: 'amber',
  }));
  recentUsers.forEach((u) => events.push({
    id: `u-${u._id}`, type: 'user', title: 'New sign-up',
    detail: `${u.name || 'A user'}${u.location ? ` · ${u.location}` : ''}`, at: u.createdAt, icon: 'UserPlus', accent: 'info',
  }));
  const activityFeed = events
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 8);

  return {
    kpis,
    revenueSeries: groupSeries, // monthly groups created (chart relabelled client-side)
    categoryDemand,
    topRegions,
    activityFeed,
    counts: { totalUsers, totalGroups, activeGroups, totalVendors, pendingVendors, openTickets, flaggedUsers },
  };
};

// Cache 30s — the dashboard is polled and these aggregations are not cheap.
const getDashboard = () => cache.wrap('admin:dashboard', SIGNALS_TTL, getDashboardData);

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
  getDashboard,
};
