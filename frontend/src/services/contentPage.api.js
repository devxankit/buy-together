import api from './api';

// ── Public ──────────────────────────────────────────────────────────
// Fetch an active content page by slug for the consumer app.
// slug ∈ help-center | terms | privacy | community-guidelines | about
export const getContentPage = (slug) => api.get(`/content-pages/${slug}`);

// ── Admin (requires admin JWT) ──────────────────────────────────────
// All editable content pages.
export const listContentPagesAdmin = () => api.get('/content-pages/admin/list');

// A single page by slug for the editor.
export const getContentPageAdmin = (slug) => api.get(`/content-pages/admin/${slug}`);

// Update (upsert) a page. Body: { title?, intro?, lastUpdated?, contactEmail?, sections?, isActive? }
export const updateContentPage = (slug, data) => api.patch(`/content-pages/admin/${slug}`, data);
