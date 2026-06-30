/**
 * Shared input validators used across admin and consumer forms.
 * Each returns a boolean; pair them with a setError(...) message at submit time.
 */

// A person/business name: must start with a letter and contain only letters,
// spaces, and a few common name punctuation marks ('.-).
export const isValidName = (v = '') => /^[A-Za-z][A-Za-z\s.'-]*$/.test(String(v).trim());

// Standard email shape.
export const isValidEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

// A 10-digit Indian mobile number (after stripping non-digits).
export const isValidIndianPhone = (v = '') => /^[6-9]\d{9}$/.test(String(v).replace(/\D/g, '').slice(-10));

// 6-digit pincode.
export const isValidPincode = (v = '') => /^\d{6}$/.test(String(v).trim());

// http(s) URL.
export const isValidUrl = (v = '') => /^https?:\/\/[^\s.]+\.[^\s]{2,}$/.test(String(v).trim());

// 3- or 6-digit hex colour, with leading #.
export const isValidHex = (v = '') => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(String(v).trim());

// A free-text field (city/location/address) that must contain at least one
// letter — rejects pure-symbol junk like "@@@" or "123###".
export const hasLetters = (v = '') => /[A-Za-z]/.test(String(v));

// Digits only (for numeric stat fields).
export const isDigitsOnly = (v = '') => /^\d+$/.test(String(v).trim());

// A date string (yyyy-mm-dd) that is today or later.
export const isNotPastDate = (v = '') => {
  if (!v) return true;
  const d = new Date(v);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(d.getTime()) && d >= today;
};

// A date string that is not in the future (for birthdates).
export const isNotFutureDate = (v = '') => {
  if (!v) return true;
  const d = new Date(v);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return !Number.isNaN(d.getTime()) && d <= today;
};
