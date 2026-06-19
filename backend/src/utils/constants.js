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

// Demand-group lifecycle surfaced in the admin Groups console. `active` →
// `closing` (almost full / deadline near) → `completed`/`locked` once the
// target is met. `flagged` is an admin-only moderation state.
const GROUP_STATUS = {
  ACTIVE: 'active',
  CLOSING: 'closing',
  COMPLETED: 'completed',
  LOCKED: 'locked',
  FLAGGED: 'flagged',
};

// Who owns/created the group — a buyer demand pool or a vendor-led offer.
const GROUP_TYPE = {
  USER: 'user',
  VENDOR: 'vendor',
};

// Grantable admin-console permissions. Each key maps to a management section a
// non-super admin can be allowed to access. Super admins implicitly have all of
// them. Dashboard and Settings (own password) are always available.
const ADMIN_PERMISSIONS = [
  'users',
  'groups',
  'categories',
  'banners',
  'homeSections',
  'vendors',
  'fraud',
  'revenue',
  'pushNotifications',
];

module.exports = {
  ROLES,
  USER_STATUS,
  OTP_PURPOSE,
  DEAL_STATUS,
  VENDOR_STATUS,
  KYC_STATUS,
  BUSINESS_TYPES,
  GROUP_STATUS,
  GROUP_TYPE,
  ADMIN_PERMISSIONS,
};
