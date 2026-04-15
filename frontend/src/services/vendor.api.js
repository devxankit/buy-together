import api from './api';

export const getVendors = () => api.get('/vendors');
export const getVendorData = (id) => api.get(`/vendors/${id}`);
export const createOffer = (data) => api.post('/vendors/offers', data);
