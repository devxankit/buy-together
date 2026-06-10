import api from './api';

// ── Group chat (messages persisted in Firebase RTDB via the backend) ──
// Fetch message history for a group, oldest-first. limit defaults server-side.
export const getMessages = (groupId, limit = 100) =>
  api.get(`/chat/messages/${groupId}`, { params: { limit } });

// Send a message. Body: { groupId, content, replyTo? }
// The backend persists to RTDB and broadcasts it over Socket.IO.
export const sendMessage = (data) => api.post('/chat/messages', data);
