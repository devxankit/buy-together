import { useState, useEffect, useCallback, useRef } from 'react';
import { getChatSocket } from '../../../services/socket';
import { getMessages, sendMessage as sendMessageApi } from '../../../services/chat.api';

/**
 * Realtime group chat hook.
 *
 * Messages are stored in Firebase Realtime Database on the backend; this hook
 * loads history over REST, then subscribes to the `/chat` Socket.IO namespace
 * for live messages. Sending POSTs to the backend (which persists to RTDB and
 * broadcasts to the room) — the new message arrives back via the socket.
 *
 * @param {string} groupId
 * @param {boolean} [enabled=true] gate the connection (e.g. only once joined)
 */
export const useChat = (groupId, enabled = true) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Load history whenever the group changes.
  useEffect(() => {
    if (!groupId || !enabled) return undefined;
    let active = true;

    setLoading(true);
    setError(null);
    getMessages(groupId)
      .then((res) => {
        if (active) setMessages(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Failed to load messages');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [groupId, enabled]);

  // Subscribe to realtime updates for this group.
  useEffect(() => {
    if (!groupId || !enabled) return undefined;

    const socket = getChatSocket();
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    const onNewMessage = (msg) => {
      if (String(msg.groupId) !== String(groupId)) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev; // de-dupe
        return [...prev, msg];
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_message', onNewMessage);
    if (socket.connected) setIsConnected(true);
    socket.emit('join_group', groupId);

    return () => {
      socket.emit('leave_group', groupId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_message', onNewMessage);
    };
  }, [groupId, enabled]);

  const sendMessage = useCallback(
    async (contentOrPayload, replyTo = null) => {
      if (!groupId) return null;

      let payload = {};
      if (typeof contentOrPayload === 'string') {
        payload = { content: contentOrPayload };
        if (replyTo) {
          payload.replyTo = replyTo;
        }
      } else {
        payload = { ...contentOrPayload };
      }

      payload.groupId = groupId;

      try {
        const res = await sendMessageApi(payload);
        // Optimistically add in case the socket echo is delayed/unavailable.
        setMessages((prev) =>
          prev.some((m) => m.id === res.data.id) ? prev : [...prev, res.data]
        );
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send message');
        throw err;
      }
    },
    [groupId]
  );

  return { messages, isConnected, loading, error, sendMessage };
};

export default useChat;
