const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ADMIN: 'admin',
};

// Account moderation states surfaced in the admin Users console.
const USER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  FLAGGED: 'flagged',
  SUSPENDED: 'suspended',
};

// Why an OTP was issued — lets us tailor copy / future rate limits per flow.
const OTP_PURPOSE = {
  LOGIN: 'login',
  SIGNUP: 'signup',
};

const DEAL_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
};

// Vendor onboarding pipeline states surfaced in the admin Vendors console.
const VENDOR_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

const KYC_STATUS = {
  SUBMITTED: 'submitted',
  VERIFIED: 'verified',
  FAILED: 'failed',
};

const BUSINESS_TYPES = {
  INDIVIDUAL: 'Individual',
  SHOP: 'Shop',
  COMPANY: 'Company',
};

module.exports = {
  ROLES,
  USER_STATUS,
  OTP_PURPOSE,
  DEAL_STATUS,
  VENDOR_STATUS,
  KYC_STATUS,
  BUSINESS_TYPES,
};
