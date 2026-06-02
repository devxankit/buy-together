import api from './api';

// ── Public ──────────────────────────────────────────────────────────
export const getVendors = () => api.get('/vendors');
export const getVendorData = (id) => api.get(`/vendors/${id}`);
export const createOffer = (data) => api.post('/vendors/offers', data);

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Params: { search?, status?, kyc?, category?, page?, limit?, sortBy? }
export const listVendorsAdmin = (params = {}) =>
  api.get('/admin/vendors', { params });

// Body: { businessName, phone, category, city, ownerName?, email?, businessType?, gstNumber?, description?, address?, pincode?, website?, logo?, status?, kyc? }
export const createVendorAdmin = (data) => api.post('/admin/vendors', data);

export const getVendorAdmin = (id) => api.get(`/admin/vendors/${id}`);

export const updateVendorAdmin = (id, data) =>
  api.patch(`/admin/vendors/${id}`, data);

export const deleteVendorAdmin = (id) => api.delete(`/admin/vendors/${id}`);

export const approveVendorAdmin = (id) =>
  api.post(`/admin/vendors/${id}/approve`);

export const rejectVendorAdmin = (id, reason = '') =>
  api.post(`/admin/vendors/${id}/reject`, { reason });
