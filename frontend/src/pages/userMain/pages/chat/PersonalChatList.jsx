import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../../../services/chat.api';

const ChatListSkeleton = () => (
  <div className="flex flex-col gap-3.5 w-full animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-surface rounded-[20px] p-4 flex gap-3.5 border border-transparent w-full">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="flex justify-between items-center">
            <div className="w-28 h-3.5 bg-slate-200 rounded-full" />
            <div className="w-10 h-2.5 bg-slate-200 rounded-full" />
          </div>
          <div className="w-48 h-3 bg-slate-200/80 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

let conversationsCache = null;

const PersonalChatList = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => conversationsCache || []);
  const [loading, setLoading] = useState(() => !conversationsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getConversations()
      .then((res) => {
        if (active) {
          const fetched = res.data || [];
          setChats(fetched);
          conversationsCache = fetched;
        }
      })
      .catch((err) => {
        if (active && !conversationsCache) {
          setError(err.response?.data?.message || 'Failed to load messages');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => { active = false; };
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F6F6F8] font-sans pb-24">
      {/* HEADER */}
      <div className="bg-surface px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm border-b border-line">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-surface-alt rounded-xl active:scale-95 transition-all text-ink">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-black text-ink">Messages</h1>
      </div>

      {/* CHAT LIST */}
      <div className="flex flex-col px-4 py-4 gap-3 w-full max-w-[430px] mx-auto">
        {loading ? (
          <ChatListSkeleton />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-sm text-red-500 font-bold">{error}</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-md font-bold text-ink mb-1">No Messages Yet</h3>
            <p className="text-sm text-faint font-medium max-w-[240px]">
              Start a conversation with other buyers inside group members list.
            </p>
            <button
              onClick={() => navigate('/groups')}
              className="mt-6 px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-all"
            >
              Explore Groups
            </button>
          </div>
        ) : (
          chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => navigate(`/messages/${chat.id}`, { state: { user: { id: chat.id, name: chat.name, avatar: chat.avatar } } })}
              className={`bg-surface rounded-[20px] p-4 flex gap-3.5 shadow-sm border ${chat.unread > 0 ? 'border-primary/20' : 'border-transparent'} active:scale-[0.98] transition-transform cursor-pointer w-full`}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-surface-alt flex-shrink-0" />
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-[14px] font-black text-ink truncate pr-2`}>
                    {chat.name}
                  </h4>
                  <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-primary' : 'text-muted'} whitespace-nowrap`}>
                    {formatTime(chat.time)}
                  </span>
                </div>
                <p className={`text-[12px] truncate ${chat.unread > 0 ? 'font-bold text-ink' : 'font-medium text-faint'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center self-center px-1">
                  {chat.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalChatList;
