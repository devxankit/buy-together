import api from './api';

// ── Public ──────────────────────────────────────────────────────────
// Active categories for the user-facing app (carousel/filters).
export const getCategories = () => api.get('/categories');

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Full list (active + hidden) with group usage counts + status counts.
export const listCategoriesAdmin = (params = {}) =>
  api.get('/categories/admin/list', { params });

// Create. Body: { name, image, description?, icon?, color?, displayOrder?, isActive? }
export const createCategory = (data) => api.post('/categories', data);

// Partial update by id.
export const updateCategory = (id, data) => api.patch(`/categories/${id}`, data);

export const deleteCategory = (id) => api.delete(`/categories/${id}`);
