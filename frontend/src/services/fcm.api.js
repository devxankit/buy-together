import api from './api';

// ── User token registration (requires auth) ─────────────────────────
export const registerWebToken = (token) => api.post('/fcm/web/register', { token });
export const registerMobileToken = (token) => api.post('/fcm/mobile/register', { token });
export const unregisterToken = (token, platform = 'web') =>
  api.delete('/fcm/unregister', { data: { token, platform } });
export const testPush = (data = {}) => api.post('/fcm/test', data);

// ── Admin broadcast (requires admin JWT) ────────────────────────────
// Separate endpoints per platform. Body: { title, body, image?, link? }
export const sendPushWeb = (data) => api.post('/admin/push/web', data);
export const sendPushMobile = (data) => api.post('/admin/push/mobile', data);
export const sendPushAll = (data) => api.post('/admin/push/all', data);
export const getPushCoverage = () => api.get('/admin/push/coverage');
export const listPushCampaigns = (params = {}) => api.get('/admin/push/campaigns', { params });
export const deletePushCampaign = (id) => api.delete(`/admin/push/campaigns/${id}`);
export const bulkDeletePushCampaigns = (ids) =>
  api.post('/admin/push/campaigns/bulk-delete', { ids });
