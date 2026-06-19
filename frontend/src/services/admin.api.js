import api from './api';

// ── Admin: console-wide counters (requires admin JWT) ───────────────
// Returns: { totalUsers, vendors, pendingVendors, admins, suspended, flagged, pending }
// `pendingVendors` feeds the sidebar badge next to "Vendors".
export const getAdminStats = () => api.get('/admin/stats');

// ── Admin: chat moderation (read-only) ──────────────────────────────
// Full group chat transcript (oldest-first).
export const getGroupChatAdmin = (groupId, limit = 500) =>
  api.get(`/admin/groups/${groupId}/messages`, { params: { limit } });

// People a given user has one-to-one chats with (newest-first).
export const getUserConversationsAdmin = (userId) =>
  api.get(`/admin/users/${userId}/conversations`);

// Transcript of the one-to-one chat between a user and one of their contacts.
export const getUserDmMessagesAdmin = (userId, otherUserId, limit = 500) =>
  api.get(`/admin/users/${userId}/conversations/${otherUserId}/messages`, { params: { limit } });

// ── Admin: fraud & risk ─────────────────────────────────────────────
// Computed risk signals from real users/groups/membership data.
// Returns: { signals: [...], summary: { open, high, medium, low, groupsAffected, accountsAtRisk } }
export const getFraudSignals = () => api.get('/admin/fraud/signals');

// ── Admin: settings, account & team ─────────────────────────────────
// General platform settings (any admin can read; super admin can update).
export const getSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.patch('/admin/settings', data);

// Change the logged-in admin's own password.
export const changePassword = (data) => api.patch('/admin/account/password', data);

// Admin team (super-admin only).
export const listAdmins = () => api.get('/admin/admins');
export const createAdminMember = (data) => api.post('/admin/admins', data);
export const updateAdminMember = (id, data) => api.patch(`/admin/admins/${id}`, data);
export const deleteAdminMember = (id) => api.delete(`/admin/admins/${id}`);

// Grantable permission keys + friendly labels (mirror backend ADMIN_PERMISSIONS).
export const ADMIN_PERMISSION_OPTIONS = [
  { key: 'users', label: 'Users' },
  { key: 'groups', label: 'Groups' },
  { key: 'categories', label: 'Categories' },
  { key: 'banners', label: 'Banners' },
  { key: 'homeSections', label: 'Home Sections' },
  { key: 'vendors', label: 'Vendors' },
  { key: 'fraud', label: 'Fraud & Risk' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'support', label: 'Support Tickets' },
  { key: 'content', label: 'Content Pages' },
  { key: 'pushNotifications', label: 'Push Notifications' },
];
