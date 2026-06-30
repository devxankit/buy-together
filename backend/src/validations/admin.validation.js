const joi = require('joi');
const {
  ROLES,
  USER_STATUS,
  VENDOR_STATUS,
  KYC_STATUS,
  BUSINESS_TYPES,
  GROUP_STATUS,
  GROUP_TYPE,
  ADMIN_PERMISSIONS,
} = require('../utils/constants');

const phone = joi
  .string()
  .pattern(/^(\+?91[\-\s]?)?[0]?[6-9]\d{9}$/)
  .messages({ 'string.pattern.base': 'Enter a valid 10-digit Indian mobile number' });

const objectId = joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'Invalid id',
});

const listUsers = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', ...Object.values(USER_STATUS)),
    role: joi.string().valid('all', ...Object.values(ROLES)),
    activity: joi.string().valid('all', 'ingroup', 'nogroup', 'chatting'),
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
    sortBy: joi.string(),
  }),
};

const createUser = {
  body: joi.object().keys({
    name: joi.string().trim().min(2).max(80).required(),
    phone: phone.required(),
    email: joi.string().email({ tlds: false }).lowercase().allow('', null),
    role: joi.string().valid(...Object.values(ROLES)),
    status: joi.string().valid(...Object.values(USER_STATUS)),
    location: joi.string().allow('', null),
    dob: joi.date(),
    avatar: joi.string().uri().allow('', null),
    isPhoneVerified: joi.boolean(),
  }),
};

const userId = {
  params: joi.object().keys({ userId: objectId.required() }),
};

const updateUser = {
  params: joi.object().keys({ userId: objectId.required() }),
  body: joi
    .object()
    .keys({
      name: joi.string().trim().min(2).max(80),
      phone,
      email: joi.string().email({ tlds: false }).lowercase().allow('', null),
      role: joi.string().valid(...Object.values(ROLES)),
      status: joi.string().valid(...Object.values(USER_STATUS)),
      location: joi.string().allow('', null),
      dob: joi.date(),
      avatar: joi.string().uri().allow('', null),
      isPhoneVerified: joi.boolean(),
    })
    .min(1),
};

// ── Vendors ─────────────────────────────────────────────────────────
const pincode = joi.string().pattern(/^\d{6}$/).messages({
  'string.pattern.base': 'Pincode must be 6 digits',
});

// Standard GSTIN (15 chars): 2-digit state, 10-char PAN, entity digit, 'Z', checksum.
const gstNumber = joi
  .string()
  .pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
  .messages({ 'string.pattern.base': 'Enter a valid 15-character GSTIN' });

const listVendors = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    status: joi.string().valid('all', ...Object.values(VENDOR_STATUS)),
    kyc: joi.string().valid('all', ...Object.values(KYC_STATUS)),
    category: joi.string().allow('', null),
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
    sortBy: joi.string(),
  }),
};

const createVendor = {
  body: joi.object().keys({
    businessName: joi.string().trim().min(2).max(120).required(),
    ownerName: joi.string().trim().min(2).max(80).allow('', null),
    phone: phone.required(),
    email: joi.string().email({ tlds: false }).lowercase().allow('', null),
    category: joi.string().trim().min(2).max(60).required(),
    businessType: joi.string().valid(...Object.values(BUSINESS_TYPES)),
    gstNumber: gstNumber.allow('', null),
    description: joi.string().max(500).allow('', null),
    city: joi.string().trim().min(2).max(60).required(),
    address: joi.string().max(240).allow('', null),
    pincode: pincode.allow('', null),
    website: joi.string().uri({ scheme: ['http', 'https'] }).allow('', null),
    logo: joi.string().uri().allow('', null),
    status: joi.string().valid(...Object.values(VENDOR_STATUS)),
    kyc: joi.string().valid(...Object.values(KYC_STATUS)),
  }),
};

const vendorId = {
  params: joi.object().keys({ vendorId: objectId.required() }),
};

const updateVendor = {
  params: joi.object().keys({ vendorId: objectId.required() }),
  body: joi
    .object()
    .keys({
      businessName: joi.string().trim().min(2).max(120),
      ownerName: joi.string().trim().min(2).max(80).allow('', null),
      phone,
      email: joi.string().email({ tlds: false }).lowercase().allow('', null),
      category: joi.string().trim().min(2).max(60),
      businessType: joi.string().valid(...Object.values(BUSINESS_TYPES)),
      gstNumber: gstNumber.allow('', null),
      description: joi.string().max(500).allow('', null),
      city: joi.string().trim().min(2).max(60),
      address: joi.string().max(240).allow('', null),
      pincode: pincode.allow('', null),
      website: joi.string().uri({ scheme: ['http', 'https'] }).allow('', null),
      logo: joi.string().uri().allow('', null),
      status: joi.string().valid(...Object.values(VENDOR_STATUS)),
      kyc: joi.string().valid(...Object.values(KYC_STATUS)),
      rejectionReason: joi.string().max(300).allow('', null),
    })
    .min(1),
};

const rejectVendor = {
  params: joi.object().keys({ vendorId: objectId.required() }),
  body: joi.object().keys({
    reason: joi.string().max(300).allow('', null),
  }),
};

// ── Groups ──────────────────────────────────────────────────────────
const listGroups = {
  query: joi.object().keys({
    search: joi.string().allow('', null),
    // `locked` is a virtual tab that also covers completed groups.
    status: joi.string().valid('all', 'locked', ...Object.values(GROUP_STATUS)),
    category: joi.string().allow('', null),
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1).max(100),
    sortBy: joi.string(),
  }),
};

const createGroup = {
  body: joi.object().keys({
    title: joi.string().trim().min(2).max(120).required(),
    productName: joi.string().trim().min(2).max(120).required(),
    description: joi.string().max(1000).allow('', null),
    slogan: joi.string().max(240).allow('', null),
    category: joi.string().trim().max(60).allow('', null),
    subCategory: joi.string().trim().max(60).allow('', null),
    type: joi.string().valid(...Object.values(GROUP_TYPE)),
    location: joi.string().max(120).allow('', null),
    coordinates: joi.object({ lat: joi.number().allow(null), lng: joi.number().allow(null) }).allow(null),
    image: joi.string().uri().allow('', null),
    spotsTotal: joi.number().integer().min(0).max(100000),
    creatorName: joi.string().max(80).allow('', null),
    status: joi.string().valid(...Object.values(GROUP_STATUS)),
    trending: joi.boolean(),
    closesAt: joi.date().allow('', null),
    members: joi.array().items(objectId),
  }),
};

const groupId = {
  params: joi.object().keys({ groupId: objectId.required() }),
};

const updateGroup = {
  params: joi.object().keys({ groupId: objectId.required() }),
  body: joi
    .object()
    .keys({
      title: joi.string().trim().min(2).max(120),
      productName: joi.string().trim().max(120).allow('', null),
      description: joi.string().max(1000).allow('', null),
      slogan: joi.string().max(240).allow('', null),
      category: joi.string().trim().max(60).allow('', null),
      subCategory: joi.string().trim().max(60).allow('', null),
      type: joi.string().valid(...Object.values(GROUP_TYPE)),
      location: joi.string().max(120).allow('', null),
      coordinates: joi.object({ lat: joi.number().allow(null), lng: joi.number().allow(null) }).allow(null),
      image: joi.string().uri().allow('', null),
      spotsTotal: joi.number().integer().min(0).max(100000),
      creatorName: joi.string().max(80).allow('', null),
      status: joi.string().valid(...Object.values(GROUP_STATUS)),
      trending: joi.boolean(),
      closesAt: joi.date().allow('', null),
      members: joi.array().items(objectId),
    })
    .min(1),
};

const addGroupMember = {
  params: joi.object().keys({ groupId: objectId.required() }),
  body: joi.object().keys({ userId: objectId.required() }),
};

const groupMember = {
  params: joi.object().keys({
    groupId: objectId.required(),
    userId: objectId.required(),
  }),
};

// ── Chat moderation (read-only) ─────────────────────────────────────
const userDmMessages = {
  params: joi.object().keys({
    userId: objectId.required(),
    otherUserId: objectId.required(),
  }),
  query: joi.object().keys({ limit: joi.number().integer().min(1).max(1000) }),
};

// ── Admin team + settings ───────────────────────────────────────────
const createAdminMember = {
  body: joi.object().keys({
    name: joi.string().trim().min(2).max(80).required(),
    email: joi.string().email({ tlds: false }).lowercase().required(),
    password: joi.string().min(8).max(128).required(),
    phone: phone.allow('', null),
    status: joi.string().valid(...Object.values(USER_STATUS)),
    isSuperAdmin: joi.boolean(),
    permissions: joi.array().items(joi.string().valid(...ADMIN_PERMISSIONS)),
  }),
};

const updateAdminMember = {
  params: joi.object().keys({ adminId: objectId.required() }),
  body: joi
    .object()
    .keys({
      name: joi.string().trim().min(2).max(80),
      email: joi.string().email({ tlds: false }).lowercase(),
      password: joi.string().min(8).max(128).allow('', null),
      phone: phone.allow('', null),
      status: joi.string().valid(...Object.values(USER_STATUS)),
      isSuperAdmin: joi.boolean(),
      permissions: joi.array().items(joi.string().valid(...ADMIN_PERMISSIONS)),
    })
    .min(1),
};

const adminMemberId = {
  params: joi.object().keys({ adminId: objectId.required() }),
};

const changePassword = {
  body: joi.object().keys({
    currentPassword: joi.string().required(),
    newPassword: joi.string().min(8).max(128).required(),
  }),
};

const updateSettings = {
  body: joi
    .object()
    .keys({
      platformName: joi.string().trim().max(80).allow('', null),
      supportEmail: joi.string().email({ tlds: false }).allow('', null),
      contactNumber: joi.string().trim().max(20).allow('', null),
      contactNumberAlt: joi.string().trim().max(20).allow('', null),
      supportAddress: joi.string().trim().max(240).allow('', null),
      liveStatsActiveGroups: joi.string().trim().max(20).allow('', null),
      liveStatsActiveGroupsTrend: joi.string().trim().max(30).allow('', null),
      liveStatsPeopleInterested: joi.string().trim().max(20).allow('', null),
      liveStatsPeopleInterestedTrend: joi.string().trim().max(30).allow('', null),
      liveStatsGroupsGrowing: joi.string().trim().max(20).allow('', null),
      liveStatsGroupsGrowingTrend: joi.string().trim().max(30).allow('', null),
      liveStatsTopCity: joi.string().trim().max(50).allow('', null),
      liveStatsTopCityTrend: joi.string().trim().max(30).allow('', null),
    })
    .min(1),
};

module.exports = {
  listUsers,
  createUser,
  userId,
  createAdminMember,
  updateAdminMember,
  adminMemberId,
  changePassword,
  updateSettings,
  updateUser,
  listVendors,
  createVendor,
  vendorId,
  updateVendor,
  rejectVendor,
  listGroups,
  createGroup,
  groupId,
  updateGroup,
  addGroupMember,
  groupMember,
  userDmMessages,
};
