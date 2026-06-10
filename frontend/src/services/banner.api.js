import api from './api';

// ── Public ──────────────────────────────────────────────────────────
// Fetch active banners for the user app carousel.
export const getBanners = () => api.get('/banners');

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Full list (active + hidden) for the admin console.
export const listBannersAdmin = (params = {}) =>
  api.get('/banners/admin/list', { params });

// Create. Body: { badge, titleLine1, titleHighlight, description, image, activeBuyers?, link?, isActive?, displayOrder? }
export const createBanner = (data) => api.post('/banners', data);

// Partial update by ID.
export const updateBanner = (id, data) => api.patch(`/banners/${id}`, data);

// Delete by ID.
export const deleteBanner = (id) => api.delete(`/banners/${id}`);
