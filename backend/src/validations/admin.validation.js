const joi = require('joi');
const {
  ROLES,
  USER_STATUS,
  VENDOR_STATUS,
  KYC_STATUS,
  BUSINESS_TYPES,
  GROUP_STATUS,
  GROUP_TYPE,
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
    productName: joi.string().trim().max(120).allow('', null),
    description: joi.string().max(1000).allow('', null),
    slogan: joi.string().max(240).allow('', null),
    category: joi.string().trim().max(60).allow('', null),
    subCategory: joi.string().trim().max(60).allow('', null),
    type: joi.string().valid(...Object.values(GROUP_TYPE)),
    location: joi.string().max(120).allow('', null),
    image: joi.string().uri().allow('', null),
    spotsTotal: joi.number().integer().min(0).max(100000),
    creatorName: joi.string().max(80).allow('', null),
    status: joi.string().valid(...Object.values(GROUP_STATUS)),
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
      image: joi.string().uri().allow('', null),
      spotsTotal: joi.number().integer().min(0).max(100000),
      creatorName: joi.string().max(80).allow('', null),
      status: joi.string().valid(...Object.values(GROUP_STATUS)),
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

module.exports = {
  listUsers,
  createUser,
  userId,
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
};
