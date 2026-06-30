import { useState, useEffect, useCallback, useRef } from 'react';
import { getChatSocket } from '../../../services/socket';
import { 
  getMessages, 
  sendMessage as sendMessageApi, 
  getPinnedMessage,
  deleteMessage as deleteMessageApi,
  reactMessage as reactMessageApi
} from '../../../services/chat.api';

// In-memory cache for Stale-While-Revalidate chat loading
const chatCache = {};

const formatMessage = (msg) => {
  if (!msg) return msg;
  const reactionsMap = msg.reactions || {};
  const emojiCounts = {};
  Object.values(reactionsMap).forEach((emoji) => {
    if (typeof emoji === 'string') {
      emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
    }
  });
  const reactions = Object.keys(emojiCounts).map((emoji) => ({
    emoji,
    count: emojiCounts[emoji],
  }));
  return {
    ...msg,
    reactions: reactions.length > 0 ? reactions : undefined,
  };
};

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
 * @param {string|null} [targetUserId=null] target user ID to track online status for DMs
 */
export const useChat = (groupId, enabled = true, targetUserId = null) => {
  const [messages, setMessages] = useState(() => (chatCache[groupId]?.messages || []).map(formatMessage));
  const [pinnedMessage, setPinnedMessage] = useState(() => chatCache[groupId]?.pinnedMessage || null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(() => !chatCache[groupId]);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState('offline');
  const socketRef = useRef(null);
  const isTypingRef = useRef(false);
  // Tracks message payloads currently being sent, to drop duplicate taps.
  const inFlightRef = useRef(new Set());

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
        const fetched = (Array.isArray(res.data) ? res.data : []).map(formatMessage);
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

    const onConnect = () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      socket.emit('join_group', groupId);
      if (targetUserId) {
        socket.emit('get_user_status', targetUserId, (res) => {
          if (res && res.status) {
            setOnlineStatus(res.status);
          }
        });
      }
    };
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      setTypingUsers([]);
    };
    const onConnectError = (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
    };

    const onNewMessage = (msg) => {
      console.log('Socket received new_message:', msg);
      if (String(msg.groupId) !== String(groupId)) return;
      const formatted = formatMessage(msg);
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === formatted.id);
        let nextList;
        if (index > -1) {
          nextList = [...prev];
          nextList[index] = formatted;
        } else {
          nextList = [...prev, formatted];
        }
        if (!chatCache[groupId]) chatCache[groupId] = {};
        chatCache[groupId].messages = nextList; // Keep cache updated in real-time
        return nextList;
      });
    };

    const onMessageDeleted = ({ messageId, groupId: msgGroupId }) => {
      console.log('Socket received message_deleted:', messageId, msgGroupId);
      if (String(msgGroupId) !== String(groupId)) return;
      setMessages((prev) => {
        const nextList = prev.filter((m) => m.id !== messageId);
        if (!chatCache[groupId]) chatCache[groupId] = {};
        chatCache[groupId].messages = nextList;
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
      chatCache[groupId].messages = chatCache[groupId].messages || [];
      chatCache[groupId].pinnedMessage = pinnedMsg;
    };

    const onMessageUnpinned = () => {
      setPinnedMessage(null);
      if (!chatCache[groupId]) chatCache[groupId] = {};
      chatCache[groupId].pinnedMessage = null;
    };

    const onUserStatus = ({ userId, status }) => {
      console.log('Socket received user_status:', userId, status);
      if (targetUserId && String(userId) === String(targetUserId)) {
        setOnlineStatus(status);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('new_message', onNewMessage);
    socket.on('message_deleted', onMessageDeleted);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);
    socket.on('message_pinned', onMessagePinned);
    socket.on('message_unpinned', onMessageUnpinned);
    socket.on('user_status', onUserStatus);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join_group', groupId);
      if (targetUserId) {
        socket.emit('get_user_status', targetUserId, (res) => {
          if (res && res.status) {
            setOnlineStatus(res.status);
          }
        });
      }
    } else {
      socket.connect();
    }

    return () => {
      socket.emit('leave_group', groupId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('new_message', onNewMessage);
      socket.off('message_deleted', onMessageDeleted);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.off('message_pinned', onMessagePinned);
      socket.off('message_unpinned', onMessageUnpinned);
      socket.off('user_status', onUserStatus);
      setTypingUsers([]);
      isTypingRef.current = false;
    };
  }, [groupId, enabled, targetUserId]);

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

      // Guard against double-sends: if the send button is tapped multiple times
      // before the request resolves, identical payloads in flight are dropped so
      // the same message isn't posted twice.
      const signature = JSON.stringify(payload);
      if (inFlightRef.current.has(signature)) return null;
      inFlightRef.current.add(signature);

      try {
        const res = await sendMessageApi(payload);
        const formatted = formatMessage(res.data);
        // Optimistically add/update in case the socket echo is delayed/unavailable.
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === formatted.id);
          let nextList;
          if (index > -1) {
            nextList = [...prev];
            nextList[index] = formatted;
          } else {
            nextList = [...prev, formatted];
          }
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].messages = nextList;
          return nextList;
        });
        return formatted;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to send message');
        throw err;
      } finally {
        inFlightRef.current.delete(signature);
      }
    },
    [groupId]
  );

  const deleteMessage = useCallback(
    async (messageId) => {
      if (!groupId) return;
      try {
        await deleteMessageApi(groupId, messageId);
        setMessages((prev) => {
          const nextList = prev.filter((m) => m.id !== messageId);
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].messages = nextList;
          return nextList;
        });
      } catch (err) {
        throw err;
      }
    },
    [groupId]
  );

  const reactMessage = useCallback(
    async (messageId, emoji) => {
      if (!groupId) return;
      try {
        const res = await reactMessageApi(groupId, messageId, emoji);
        const formatted = formatMessage(res.data);
        setMessages((prev) => {
          const index = prev.findIndex((m) => m.id === formatted.id);
          let nextList;
          if (index > -1) {
            nextList = [...prev];
            nextList[index] = formatted;
          } else {
            nextList = [...prev, formatted];
          }
          if (!chatCache[groupId]) chatCache[groupId] = {};
          chatCache[groupId].messages = nextList;
          return nextList;
        });
      } catch (err) {
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
    deleteMessage,
    reactMessage,
    startTyping,
    stopTyping,
    onlineStatus,
  };
};

export default useChat;
