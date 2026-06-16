import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;
let currentToken = null;

/**
 * Lazily creates (and reuses) a single authenticated connection to the backend
 * `/chat` namespace. The JWT is sent in the handshake so the server can verify
 * the user — same token the REST API uses. If the token changes, the connection
 * is automatically re-established with the new token.
 */
export const getChatSocket = () => {
  const token = localStorage.getItem('token');

  if (socket && currentToken === token) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  currentToken = token;
  socket = io(`${SOCKET_URL}/chat`, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: { token },
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};

