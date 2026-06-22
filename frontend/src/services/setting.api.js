import api from './api';

export const getPublicSettings = () => api.get('/settings/public');
