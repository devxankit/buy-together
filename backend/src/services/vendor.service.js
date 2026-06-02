const httpStatus = require('http-status').status;
const Vendor = require('../models/Vendor');
const ApiError = require('../utils/ApiError');
const { normalizePhone } = require('./auth.service');
const { VENDOR_STATUS, KYC_STATUS } = require('../utils/constants');

/** Self-service / legacy vendor creation. Currently unused by the admin flow. */
const createVendor = async (vendorBody) => {
  return Vendor.create(vendorBody);
};

/** Public/light vendor listing (used outside the admin console). */
const queryVendors = async () => {
  return Vendor.find({ status: VENDOR_STATUS.VERIFIED });
};

/**
 * Admin vendor listing with search, status/kyc filters, pagination, and a
 * counts breakdown for the summary tabs in the console.
 */
const queryVendorsAdmin = async (filter = {}) => {
  const { search, status, kyc, category, page = 1, limit = 20, sortBy = '-createdAt' } = filter;

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (kyc && kyc !== 'all') query.kyc = kyc;
  if (category && category !== 'all') query.category = category;
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { businessName: rx },
      { ownerName: rx },
      { phone: rx },
      { email: rx },
      { category: rx },
      { city: rx },
      { gstNumber: rx },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [results, totalResults, counts] = await Promise.all([
    Vendor.find(query).sort(sortBy).skip(skip).limit(limitNum),
    Vendor.countDocuments(query),
    Vendor.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const statusCounts = Object.values(VENDOR_STATUS).reduce((a, s) => ({ ...a, [s]: 0 }), {});
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

const getVendorByIdAdmin = async (id) => {
  const v = await Vendor.findById(id);
  if (!v) throw new ApiError(httpStatus.NOT_FOUND, 'Vendor not found');
  return v;
};

/**
 * Admin creates a vendor. Phone is normalised + uniqueness-checked. The
 * vendor lands as `pending` unless the admin explicitly approves on create.
 */
const createVendorAdmin = async (body) => {
  const phone = normalizePhone(body.phone);

  if (await Vendor.isPhoneTaken(phone)) {
    throw new ApiError(httpStatus.CONFLICT, 'A vendor with this mobile number already exists');
  }

  const status = body.status || VENDOR_STATUS.PENDING;

  return Vendor.create({
    businessName: body.businessName,
    ownerName: body.ownerName,
    phone,
    email: body.email || undefined,
    category: body.category,
    businessType: body.businessType,
    gstNumber: body.gstNumber,
    description: body.description,
    city: body.city,
    address: body.address,
    pincode: body.pincode,
    website: body.website,
    logo: body.logo,
    status,
    kyc: body.kyc || KYC_STATUS.SUBMITTED,
    approvedAt: status === VENDOR_STATUS.VERIFIED ? new Date() : undefined,
  });
};

const updateVendorByIdAdmin = async (id, body) => {
  const vendor = await getVendorByIdAdmin(id);

  if (body.phone) {
    const phone = normalizePhone(body.phone);
    if (phone !== vendor.phone && (await Vendor.isPhoneTaken(phone, vendor._id))) {
      throw new ApiError(httpStatus.CONFLICT, 'A vendor with this mobile number already exists');
    }
    body.phone = phone;
  }

  // Stamp approval/rejection timestamps when status flips.
  if (body.status && body.status !== vendor.status) {
    if (body.status === VENDOR_STATUS.VERIFIED) {
      body.approvedAt = new Date();
      body.rejectedAt = null;
    } else if (body.status === VENDOR_STATUS.REJECTED) {
      body.rejectedAt = new Date();
    }
  }

  Object.assign(vendor, body);
  await vendor.save();
  return vendor;
};

const deleteVendorByIdAdmin = async (id) => {
  const v = await getVendorByIdAdmin(id);
  await v.deleteOne();
  return v;
};

/** Quick status transitions used by the row-level approve/reject buttons. */
const approveVendor = (id) =>
  updateVendorByIdAdmin(id, { status: VENDOR_STATUS.VERIFIED, kyc: KYC_STATUS.VERIFIED });

const rejectVendor = (id, reason) =>
  updateVendorByIdAdmin(id, {
    status: VENDOR_STATUS.REJECTED,
    kyc: KYC_STATUS.FAILED,
    rejectionReason: reason || '',
  });

module.exports = {
  createVendor,
  queryVendors,
  queryVendorsAdmin,
  getVendorByIdAdmin,
  createVendorAdmin,
  updateVendorByIdAdmin,
  deleteVendorByIdAdmin,
  approveVendor,
  rejectVendor,
};
