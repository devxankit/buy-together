import api from './api';

// ── User auth (mobile + OTP) ────────────────────────────────────────
// Request an OTP for an existing/new mobile (login flow). Body: { phone }
export const sendOtp = (data) => api.post('/auth/login', data);
// Alias kept for clarity at call sites.
export const login = sendOtp;
// Start signup: store profile + send OTP. Body: { name, email?, phone }
export const register = (data) => api.post('/auth/register', data);
// Verify OTP -> { user, token }. Body: { phone, otp, name?, email? }
export const verifyOtp = (data) => api.post('/auth/verify-otp', data);
// Re-issue an OTP. Body: { phone, purpose? }
export const resendOtp = (data) => api.post('/auth/resend-otp', data);

// ── Admin auth (email + password) ───────────────────────────────────
// Admin console login -> { user, token }. Body: { email, password }
export const adminLogin = (data) => api.post('/auth/admin/login', data);

export const logout = () => api.post('/auth/logout');
