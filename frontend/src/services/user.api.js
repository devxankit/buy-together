import api from './api';

// ── Admin: user management (requires admin JWT) ─────────────────────
// All routes are buyer-scoped from the caller — the admin Users console
// only manages role:'user' (vendor accounts live in a separate model).

// Params: { search?, status?, role?, page?, limit?, sortBy? }
export const listUsersAdmin = (params = {}) =>
  api.get('/admin/users', { params });

// Body: { name, phone, location?, status?, isPhoneVerified? }
// Server creates the account active + phone-verified so the buyer can
// immediately sign in on the mobile app via OTP.
export const createUserAdmin = (data) => api.post('/admin/users', data);

export const getUserAdmin = (id) => api.get(`/admin/users/${id}`);

export const updateUserAdmin = (id, data) =>
  api.patch(`/admin/users/${id}`, data);

export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);
