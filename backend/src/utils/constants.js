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

const GENDERS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
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

module.exports = {
  ROLES,
  USER_STATUS,
  GENDERS,
  OTP_PURPOSE,
  DEAL_STATUS,
};
