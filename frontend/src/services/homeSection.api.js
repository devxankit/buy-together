import api from './api';

// ── Public ──────────────────────────────────────────────────────────
// Active, curated home-page sections (each with its groups populated).
export const getHomeSections = () => api.get('/home-sections');

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Full list (active + hidden) for the admin console.
export const listHomeSectionsAdmin = (params = {}) =>
  api.get('/home-sections/admin/list', { params });

// Create. Body: { title, layout?, groups?, viewAllLink?, isActive?, displayOrder? }
export const createHomeSection = (data) => api.post('/home-sections', data);

// Partial update by ID.
export const updateHomeSection = (id, data) => api.patch(`/home-sections/${id}`, data);

// Delete by ID.
export const deleteHomeSection = (id) => api.delete(`/home-sections/${id}`);
