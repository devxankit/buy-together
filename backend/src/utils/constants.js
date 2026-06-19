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
  'support',
  'content',
];

// Support-ticket lifecycle surfaced in the admin Support console.
//  open → in_progress (an admin is handling it) → resolved → closed.
const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// User-selectable ticket topics in the Help Center.
const TICKET_CATEGORY = {
  GENERAL: 'general',
  ACCOUNT: 'account',
  PAYMENT: 'payment',
  GROUP: 'group',
  ORDER: 'order',
  OTHER: 'other',
};

// Fixed set of admin-editable content pages, keyed by slug. These back the
// consumer app's Help Center, legal, and info screens.
const CONTENT_PAGE_SLUGS = [
  'help-center',
  'terms',
  'privacy',
  'community-guidelines',
  'about',
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
  TICKET_STATUS,
  TICKET_PRIORITY,
  TICKET_CATEGORY,
  CONTENT_PAGE_SLUGS,
};
