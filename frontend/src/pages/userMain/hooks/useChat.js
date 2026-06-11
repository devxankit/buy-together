import { useState, useEffect, useCallback, useRef } from 'react';
import { getChatSocket } from '../../../services/socket';
import { getMessages, sendMessage as sendMessageApi, getPinnedMessage } from '../../../services/chat.api';

// In-memory cache for Stale-While-Revalidate chat loading
const chatCache = {};

/**
 * Realtime group/DM chat hook.
 *
 * Messages are stored in Firebase Realtime Database on the backend; this hook
 * loads history over REST, then subscribes to the `/chat` Socket.IO namespace
 * for live messages. Stale-While-Revalidate (SWR) caching is used to ensure
 * instant transitions. Typing indicators are synced in real-time.
 *
 * @param {string} groupId
 * @param {boolean} [enabled=true] gate the connection (e.g. only once joined)
 */
export const useChat = (groupId, enabled = true) => {
  const [messages, setMessages] = useState(() => chatCache[groupId]?.messages || []);
  const [pinnedMessage, setPinnedMessage] = useState(() => chatCache[groupId]?.pinnedMessage || null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(() => !chatCache[groupId]);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  const isTypingRef = useRef(false);

  // Load history whenever the group changes (Stale-While-Revalidate)
  useEffect(() => {
    if (!groupId || !enabled) return undefined;
    let active = true;

    // Only set loading if cache is empty (keeps load instant if cached)
    if (!chatCache[groupId]) {
      setLoading(true);
    }
    setError(null);

    getMessages(groupId)
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        if (active) {
          setMessages(fetched);
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].messages = fetched; // Update cache
        }
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Failed to load messages');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Fetch pinned message in parallel
    getPinnedMessage(groupId)
      .then((res) => {
        if (active) {
          setPinnedMessage(res.data || null);
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].pinnedMessage = res.data || null;
        }
      })
      .catch((err) => {
        console.error('Failed to fetch pinned message:', err);
      });

    return () => {
      active = false;
    };
  }, [groupId, enabled]);

  // Subscribe to realtime updates for this group
  useEffect(() => {
    if (!groupId || !enabled) return undefined;

    const socket = getChatSocket();
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => {
      setIsConnected(false);
      setTypingUsers([]);
    };

    const onNewMessage = (msg) => {
      if (String(msg.groupId) !== String(groupId)) return;
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === msg.id);
        let nextList;
        if (index > -1) {
          nextList = [...prev];
          nextList[index] = msg;
        } else {
          nextList = [...prev, msg];
        }
        if (!chatCache[groupId]) chatCache[groupId] = {};
        chatCache[groupId].messages = nextList; // Keep cache updated in real-time
        return nextList;
      });
    };

    const onUserTyping = ({ userId, userName }) => {
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === userId)) return prev;
        return [...prev, { userId, userName }];
      });
    };

    const onUserStopTyping = ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const onMessagePinned = (pinnedMsg) => {
      setPinnedMessage(pinnedMsg);
      if (!chatCache[groupId]) chatCache[groupId] = {};
      chatCache[groupId].pinnedMessage = pinnedMsg;
    };

    const onMessageUnpinned = () => {
      setPinnedMessage(null);
      if (!chatCache[groupId]) chatCache[groupId] = {};
      chatCache[groupId].pinnedMessage = null;
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);
    socket.on('message_pinned', onMessagePinned);
    socket.on('message_unpinned', onMessageUnpinned);

    if (socket.connected) setIsConnected(true);
    socket.emit('join_group', groupId);

    return () => {
      socket.emit('leave_group', groupId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.off('message_pinned', onMessagePinned);
      socket.off('message_unpinned', onMessageUnpinned);
      setTypingUsers([]);
      isTypingRef.current = false;
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
        // Optimistically add/update in case the socket echo is delayed/unavailable.
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === res.data.id);
          let nextList;
          if (index > -1) {
            nextList = [...prev];
            nextList[index] = res.data;
          } else {
            nextList = [...prev, res.data];
          }
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].messages = nextList;
          return nextList;
        });
        return res.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send message');
        throw err;
      }
    },
    [groupId]
  );

  const startTyping = useCallback((userName) => {
    const socket = socketRef.current;
    if (!socket || !groupId || isTypingRef.current) return;
    isTypingRef.current = true;
    socket.emit('typing', { groupId, userName });
  }, [groupId]);

  const stopTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || !groupId || !isTypingRef.current) return;
    isTypingRef.current = false;
    socket.emit('stop_typing', { groupId });
  }, [groupId]);

  return {
    messages,
    isConnected,
    loading,
    error,
    typingUsers,
    pinnedMessage,
    sendMessage,
    startTyping,
    stopTyping,
  };
};

export default useChat;
