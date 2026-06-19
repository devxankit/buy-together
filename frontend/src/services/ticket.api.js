import api from './api';

// ── Consumer app (authenticated user) ───────────────────────────────
// Submit a support ticket. Body: { subject, message, category?, name?, email?, phone? }
export const createTicket = (data) => api.post('/tickets', data);

// The current user's own tickets (most recent first).
export const getMyTickets = () => api.get('/tickets/my');

// A single ticket the user owns (full conversation thread).
export const getMyTicket = (id) => api.get(`/tickets/${id}`);

// Append a reply to one of the user's own tickets. Body: { body }
export const replyToTicket = (id, body) => api.post(`/tickets/${id}/reply`, { body });

// ── Admin (requires admin JWT) ──────────────────────────────────────
// Params: { search?, status?, priority?, page?, limit? }
// `status` accepts the tab keys: all | open | in_progress | resolved | closed.
export const listTicketsAdmin = (params = {}) => api.get('/tickets/admin/list', { params });

export const getTicketAdmin = (id) => api.get(`/tickets/admin/${id}`);

// Admin reply. Body: { body }
export const replyToTicketAdmin = (id, body) => api.post(`/tickets/admin/${id}/reply`, { body });

// Update status / priority. Body: { status?, priority? }
export const updateTicketAdmin = (id, data) => api.patch(`/tickets/admin/${id}`, data);

export const deleteTicketAdmin = (id) => api.delete(`/tickets/admin/${id}`);
