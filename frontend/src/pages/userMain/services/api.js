/**
 * Base API integration layer for userMain module.
 * Isolates endpoint paths, global fetch interceptors, and JWT headers.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/v1';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const session = localStorage.getItem('user_main_session');
  if (session) {
    const { token } = JSON.parse(session);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    return res.json();
  },
  
  post: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Post failed: ${res.statusText}`);
    return res.json();
  },
  
  put: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Put failed: ${res.statusText}`);
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.statusText}`);
    return res.json();
  }
};

export default api;
