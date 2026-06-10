import api from './api';

// ── Consumer app ────────────────────────────────────────────────────
export const getGroups = (params) => api.get('/groups', { params });
export const getGroup = (id) => api.get(`/groups/${id}`);
export const createGroup = (data) => api.post('/groups', data);
export const joinGroup = (id) => api.post(`/groups/${id}/join`);
export const leaveGroup = (id) => api.post(`/groups/${id}/leave`);

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Params: { search?, status?, category?, page?, limit?, sortBy? }
// `status` accepts the tab keys: all | active | closing | locked | flagged.
export const listGroupsAdmin = (params = {}) =>
  api.get('/admin/groups', { params });

// Body: { title, description?, slogan?, category?, type?, location?, image?,
//         spotsTotal?, creatorName?, status?, closesAt?, members? }
export const createGroupAdmin = (data) => api.post('/admin/groups', data);

export const getGroupAdmin = (id) => api.get(`/admin/groups/${id}`);

export const updateGroupAdmin = (id, data) =>
  api.patch(`/admin/groups/${id}`, data);

export const deleteGroupAdmin = (id) => api.delete(`/admin/groups/${id}`);

export const addGroupMember = (id, userId) =>
  api.post(`/admin/groups/${id}/members`, { userId });

export const removeGroupMember = (id, userId) =>
  api.delete(`/admin/groups/${id}/members/${userId}`);
