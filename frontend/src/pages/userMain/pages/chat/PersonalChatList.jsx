import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../../../../services/chat.api';
import { getGroups } from '../../../../services/group.api';

const ChatListSkeleton = () => (
  <div className="flex flex-col gap-3.5 w-full animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-surface rounded-[24px] p-4 flex gap-3.5 border border-transparent w-full">
        <div className="w-[52px] h-[52px] rounded-full bg-slate-200 flex-shrink-0" />
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
let groupsCache = null;

const PersonalChatList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('group'); // Default to Group Chat
  const [searchQuery, setSearchQuery] = useState('');
  
  // Personal Chats States
  const [chats, setChats] = useState(() => conversationsCache || []);
  const [loadingChats, setLoadingChats] = useState(() => !conversationsCache);
  const [chatsError, setChatsError] = useState(null);

  // Group Chats States (all groups user belongs to)
  const [groups, setGroups] = useState(() => groupsCache || []);
  const [loadingGroups, setLoadingGroups] = useState(() => !groupsCache);
  const [groupsError, setGroupsError] = useState(null);

  // Fetch Personal Chats
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
          setChatsError(err.response?.data?.message || 'Failed to load messages');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingChats(false);
        }
      });
    return () => { active = false; };
  }, []);

  // Fetch user's joined and created groups to find mutual group memberships
  useEffect(() => {
    let active = true;
    Promise.all([
      getGroups({ joined: 'true' }),
      getGroups({ created: 'true' })
    ])
      .then(([joinedRes, createdRes]) => {
        if (active) {
          const joined = joinedRes.data || [];
          const created = createdRes.data || [];
          const allGroups = [...created, ...joined];
          setGroups(allGroups);
          groupsCache = allGroups;
        }
      })
      .catch((err) => {
        if (active && !groupsCache) {
          setGroupsError(err.response?.data?.message || 'Failed to load groups');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingGroups(false);
        }
      });
    return () => { active = false; };
  }, []);

  // Compute shared groups for a specific person
  const getSharedGroupsInfo = (otherUserId) => {
    const shared = groups.filter(group => {
      const isAdmin = String(group.admin?._id || group.admin?.id || group.admin) === String(otherUserId);
      const isMember = group.members?.some(m => String(m._id || m.id) === String(otherUserId));
      return isAdmin || isMember;
    });

    if (shared.length === 0) return null;
    const names = shared.map(g => g.title).join(', ');
    return {
      count: shared.length,
      names: names
    };
  };

  // WhatsApp-like sorting + Search Filtering
  const sortedChats = useMemo(() => {
    const filtered = chats.filter(chat => 
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const timeA = a.time ? new Date(a.time).getTime() : 0;
      const timeB = b.time ? new Date(b.time).getTime() : 0;
      return timeB - timeA;
    });
  }, [chats, searchQuery]);

  const sortedGroups = useMemo(() => {
    const filtered = groups.filter(group => 
      group.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.slogan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      return timeB - timeA;
    });
  }, [groups, searchQuery]);

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

  const isLoading = activeTab === 'personal' ? loadingChats : loadingGroups;
  const error = activeTab === 'personal' ? chatsError : groupsError;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--surface-deep)] font-sans pb-24 select-none">
      {/* HEADER */}
      <div className="bg-surface sticky top-0 z-10 shadow-[0_2px_12px_rgba(15,23,42,0.03)] border-b border-line">
        <div className="px-5 pt-5 pb-3.5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-alt rounded-2xl active:scale-95 transition-all text-ink">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-[20px] font-black text-ink tracking-tight">Messages</h1>
            <p className="text-[11px] text-muted font-semibold">Connect & save together</p>
          </div>
        </div>

        {/* Tab Toggle Control */}
        <div className="px-5 pb-3 flex">
          <div className="flex w-full bg-surface-alt p-1.5 rounded-[18px] border border-line relative select-none">
            {/* Animated background sliding pill */}
            <div 
              className="absolute top-1.5 bottom-1.5 rounded-[14px] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-deep)] shadow-md shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                left: activeTab === 'group' ? '6px' : 'calc(50% + 2px)',
                width: 'calc(50% - 8px)'
              }}
            />

            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-2.5 text-center text-[12.5px] font-extrabold rounded-[14px] transition-all duration-300 z-10 ${
                activeTab === 'group' ? 'text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Group Chat
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-2.5 text-center text-[12.5px] font-extrabold rounded-[14px] transition-all duration-300 z-10 ${
                activeTab === 'personal' ? 'text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Person Chat
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2.5 bg-surface-alt border border-line rounded-[16px] px-3.5 h-[40px] focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'group' ? 'group chats' : 'person chats'}...`}
              className="flex-1 bg-transparent text-[13px] font-semibold text-ink placeholder:text-faint outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-surface-alt rounded-full text-faint">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex flex-col px-5 py-4 gap-3 w-full max-w-[430px] mx-auto animate-fadeIn" key={activeTab}>
        {isLoading ? (
          <ChatListSkeleton />
        ) : error ? (
          <div className="text-center py-10 bg-surface rounded-3xl p-6 border border-line shadow-sm">
            <p className="text-sm text-red-500 font-bold">{error}</p>
          </div>
        ) : activeTab === 'personal' ? (
          // PERSONAL (PERSON) CHATS VIEW
          sortedChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6 bg-surface rounded-[28px] border border-line shadow-sm">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-black text-ink mb-1">No Messages Found</h3>
              <p className="text-xs text-muted font-semibold max-w-[240px]">
                {searchQuery ? "Try searching for a different name or keyword." : "Start a conversation with other buyers inside group members list."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/groups')}
                  className="mt-6 px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-all"
                >
                  Explore Groups
                </button>
              )}
            </div>
          ) : (
            sortedChats.map(chat => {
              const sharedInfo = getSharedGroupsInfo(chat.id);

              return (
                <div 
                  key={chat.id} 
                  onClick={() => navigate(`/messages/${chat.id}`, { state: { user: { id: chat.id, name: chat.name, avatar: chat.avatar } } })}
                  className={`bg-surface rounded-[24px] p-4 flex gap-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.02)] border ${chat.unread > 0 ? 'border-primary/20' : 'border-line'} active:scale-[0.98] transition-all duration-200 cursor-pointer w-full hover:border-primary/10`}
                >
                  <img src={chat.avatar} alt={chat.name} className="w-[52px] h-[52px] rounded-full object-cover bg-surface-alt flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-[14.5px] font-black text-ink truncate pr-2">
                        {chat.name}
                      </h4>
                      <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-primary' : 'text-faint'} whitespace-nowrap`}>
                        {formatTime(chat.time)}
                      </span>
                    </div>

                    {/* Shared Groups Indicator */}
                    {sharedInfo && (
                      <div className="flex items-center gap-1 text-[9.5px] text-primary font-bold mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">
                          Shared: {sharedInfo.count} {sharedInfo.count === 1 ? 'group' : 'groups'} ({sharedInfo.names})
                        </span>
                      </div>
                    )}

                    <p className={`text-[12.5px] truncate ${chat.unread > 0 ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="min-w-[20px] h-[20px] rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center self-center px-1.5 shadow-sm shadow-primary/20">
                      {chat.unread}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          // GROUP CHATS VIEW
          sortedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6 bg-surface rounded-[28px] border border-line shadow-sm">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-black text-ink mb-1">No Groups Found</h3>
              <p className="text-xs text-muted font-semibold max-w-[240px]">
                {searchQuery ? "Try searching for a different group name or keyword." : "Join a buying group to start communicating with other members."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate('/groups')}
                  className="mt-6 px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-all"
                >
                  Join a Group
                </button>
              )}
            </div>
          ) : (
            sortedGroups.map(group => {
              const groupId = group.id || group._id;
              const lastSeen = Number(localStorage.getItem(`buytogether_group_last_seen_${groupId}`) || 0);
              const groupTime = new Date(group.updatedAt || group.createdAt).getTime();
              const hasUnread = groupTime > lastSeen;

              return (
                <div 
                  key={groupId} 
                  onClick={() => navigate(`/groups/${groupId}/chat`, { state: { group, isJoined: true } })}
                  className={`bg-surface rounded-[24px] p-4 flex gap-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.02)] border ${hasUnread ? 'border-primary/20' : 'border-line'} active:scale-[0.98] transition-all duration-200 cursor-pointer w-full hover:border-primary/10`}
                >
                  <div className="relative w-[52px] h-[52px] bg-slate-50 dark:bg-slate-800 border border-line rounded-2xl overflow-hidden flex items-center justify-center p-1 flex-shrink-0 self-center">
                    <img src={group.image} alt={group.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className="text-[14.5px] font-black text-ink truncate">
                          {group.title}
                        </h4>
                        <span className="bg-[#E6F4F2] dark:bg-slate-800 text-primary dark:text-teal-400 text-[8.5px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                          Group
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold ${hasUnread ? 'text-primary' : 'text-faint'} whitespace-nowrap`}>
                        {formatTime(group.updatedAt || group.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[12.5px] truncate ${hasUnread ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
                      {group.slogan || 'Group chat is active'}
                    </p>
                  </div>
                  {hasUnread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary self-center mr-1 shadow-sm shadow-primary/30" />
                  )}
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
};

export default PersonalChatList;
