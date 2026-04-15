import api from './api';

export const getDeals = () => api.get('/deals');
export const getDeal = (id) => api.get(`/deals/${id}`);
export const claimDeal = (id) => api.post(`/deals/${id}/claim`);
