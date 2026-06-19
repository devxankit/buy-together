import api from './api';

// ── Admin: user management (requires admin JWT) ─────────────────────
// All routes are buyer-scoped from the caller — the admin Users console
// only manages role:'user' (vendor accounts live in a separate model).

// Params: { search?, status?, role?, activity?, page?, limit?, sortBy? }
// activity: 'all' | 'ingroup' | 'nogroup' | 'chatting' — filters by group
// membership and one-to-one chat activity.
export const listUsersAdmin = (params = {}) =>
  api.get('/admin/users', { params });

// Body: { name, phone, location?, status?, isPhoneVerified? }
// Server creates the account active + phone-verified so the buyer can
// immediately sign in on the mobile app via OTP.
// Detailed buyer statistics for the admin Users dashboard.
// Returns: { total, active, pending, flagged, suspended, verified,
//   newToday, newThisMonth, dau, wau, mau, inGroup, noGroup, chatting, highlyActive }
export const getUserStatsAdmin = () => api.get('/admin/users/stats');

export const createUserAdmin = (data) => api.post('/admin/users', data);

export const getUserAdmin = (id) => api.get(`/admin/users/${id}`);

export const updateUserAdmin = (id, data) =>
  api.patch(`/admin/users/${id}`, data);

export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);

// ── Buyer: profile management (requires user JWT) ───────────────────
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.patch('/users/profile', data);
export const getUserPublicProfile = (userId) => api.get(`/users/${userId}`);
