import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom scalable hook managing live real-time chats inside group pools.
 * Provides web-socket connection abstractions, active text buffers, and disconnect backups.
 */
export const useChat = (groupId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!groupId) return;
    
    // Simulate real-time websocket connection
    setIsConnected(true);
    setMessages([
      { id: 'm1', sender: 'Ankit', text: 'Hey guys, avocado deal pool!', time: '10:15 AM' },
      { id: 'm2', sender: 'Sneha', text: 'Sharing the invite link in my housing group now.', time: '10:16 AM' }
    ]);

    return () => {
      setIsConnected(false);
      setMessages([]);
    };
  }, [groupId]);

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'Hritik (You)',
      text,
      time: 'Just now',
      isSelf: true
    };
    setMessages(prev => [...prev, newMsg]);
    // Here we would push to socketRef.current.send(...) in production
  }, []);

  return {
    messages,
    isConnected,
    sendMessage
  };
};

export default useChat;
