import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useChat } from '../../hooks/useChat';
import { getUserPublicProfile } from '../../../../services/user.api';
import { showToast } from '../../../../utils/toast';
import api from '../../../../services/api';
import { getChatSocket } from '../../../../services/socket';
import ContactProfile from './ContactProfile';

const ChatSkeleton = () => (
  <div className="flex flex-col gap-5 px-4 py-6 w-full max-w-[430px] mx-auto animate-pulse">
    {[1, 2, 3, 4].map((i) => {
      const isLeft = i % 2 !== 0;
      return (
        <div key={i} className={`flex gap-3 w-full ${isLeft ? '' : 'flex-row-reverse'}`}>
          {isLeft && <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />}
          <div className={`flex flex-col gap-1.5 max-w-[70%] ${isLeft ? 'items-start' : 'items-end'}`}>
            {isLeft && <div className="w-24 h-3.5 bg-slate-200 rounded-full" />}
            <div className={`h-12 bg-slate-200 rounded-[14px] w-48 ${isLeft ? 'rounded-tl-sm' : 'rounded-tr-sm'}`} />
          </div>
        </div>
      );
    })}
  </div>
);

const getPlaceholderAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;

const TopBar = ({ navigate, user, onlineStatus, onProfileClick, onMenuToggle, isMenuOpen, onViewContact }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-line sticky top-0 z-30 w-full gap-2">
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <button onClick={() => navigate(-1)} className="p-1 active:scale-95 transition-all flex-shrink-0 text-ink hover:bg-surface-alt rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={onProfileClick} className="flex items-center gap-3 min-w-0 flex-1 text-left active:opacity-80 transition-opacity">
        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-surface-alt flex-shrink-0" />

        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-[14px] font-black text-ink truncate leading-tight">
            {user.name}
          </h1>
          <p className={`text-[11px] font-bold mt-0.5 truncate leading-none ${onlineStatus === 'online' ? 'text-green-600' : 'text-faint'}`}>
            {onlineStatus === 'online' ? 'Online' : 'Tap here for contact info'}
          </p>
        </div>
      </button>
    </div>

    <div className="flex items-center gap-1 flex-shrink-0 relative">
      <button onClick={onMenuToggle} className="p-2 active:scale-95 transition-all text-faint hover:bg-surface-alt rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute top-[44px] right-0 w-[190px] bg-surface rounded-2xl border border-line shadow-2xl py-2 z-50 animate-fadeIn">
          <button
            onClick={onViewContact}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>View Contact</span>
          </button>
          <button
            onClick={() => { onMenuToggle(); showToast('Notifications muted for this chat.', '🔇'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span>Mute Notifications</span>
          </button>
          <div className="border-t border-line my-1"></div>
          <button
            onClick={() => { onMenuToggle(); showToast('Thanks for reporting. Our team will review this user.', '📢'); }}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Report User</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

const ChatMessage = ({ id, avatar, name, role, time, content, image, video, reactions, replyTo, quoteData, onVote, documentData, locationData, voiceData, onLongPress, replyData, onLike, onReply, uploading, isMe, read }) => {
  let pressTimer = null;
  let lastTap = 0;
  let startX = 0;

  const handleStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
    }
    const now = Date.now();
    if (now - lastTap < 300) {
      if (onLike) onLike(id);
      if (pressTimer) clearTimeout(pressTimer);
      return;
    }
    lastTap = now;

    pressTimer = setTimeout(() => {
      if (onLongPress) onLongPress({ id, content, name });
    }, 2000); // Long-press hold set to 2 seconds
  };

  const handleEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
    startX = 0;
  };

  const handleMove = (e) => {
    if (pressTimer) clearTimeout(pressTimer);
    if (e.touches && e.touches.length > 0 && startX !== 0) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      if (Math.abs(deltaX) > 50) {
        if (onReply) onReply({ id, content, name });
        startX = 0; 
      }
    }
  };

  const handleDoubleClick = () => {
    if (onReply) onReply({ id, content, name });
  };

  return (
    <div 
      className={`flex gap-2.5 mb-5 px-4 w-full select-none cursor-pointer active:opacity-95 transition-opacity ${isMe ? 'flex-row-reverse' : ''}`}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleMove}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onDoubleClick={handleDoubleClick}
    >
      {!isMe && <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-slate-200 mt-1" />}
      <div className={`flex-1 flex flex-col min-w-0 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div 
          className="bg-surface rounded-[14px] p-3 shadow-sm border border-line relative max-w-full"
          style={isMe ? { borderBottomRightRadius: '4px', backgroundColor: '#e6f7f6', borderColor: 'transparent' } : { borderTopLeftRadius: '4px' }}
        >
          {replyData && (
            <div className="mb-2 bg-surface-alt border-l-[3px] border-primary px-2.5 py-1.5 rounded-r-xl text-left text-[11px] leading-tight select-none">
              <span className="block font-black text-primary mb-0.5">{replyData.name}</span>
              <span className="text-muted line-clamp-1">{replyData.content}</span>
            </div>
          )}
          
          {content && <p className="text-[12px] text-ink leading-relaxed break-words whitespace-pre-wrap">{content}</p>}

          {image && (
            <div className="mt-2 rounded-xl overflow-hidden border border-line cursor-pointer active:scale-[0.98] transition-all relative">
              <img src={image} alt="Attachment" className={`w-full h-auto object-cover max-h-[200px] transition-all ${uploading ? 'opacity-60 blur-[2px]' : ''}`} />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-sm shadow-md">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}

          {video && (
            <div className="mt-2 rounded-xl overflow-hidden border border-line relative max-w-full">
              {uploading ? (
                <div className="relative w-full h-[180px] bg-slate-900 flex items-center justify-center rounded-xl">
                  <div className="absolute inset-0 bg-slate-950 opacity-60 blur-[2px] rounded-xl" />
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white backdrop-blur-sm z-10 shadow-md">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              ) : (
                <video src={video} controls className="w-full h-auto max-h-[240px] rounded-xl bg-black" />
              )}
            </div>
          )}

          {documentData && (
            <div className="mt-2 border border-line rounded-xl p-3 bg-surface-alt flex items-center gap-3 relative max-w-full">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-ink truncate leading-tight">{documentData.name}</span>
                <span className="text-[9.5px] font-semibold text-faint mt-0.5">{documentData.size} • Document</span>
              </div>
              {uploading ? (
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : documentData.url ? (
                <a 
                  href={documentData.url.replace('/upload/', '/upload/fl_attachment/')} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  download={documentData.name}
                  className="p-1.5 text-muted hover:text-primary active:scale-95 transition-colors flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              ) : (
                <button className="p-1.5 text-muted hover:text-primary active:scale-95 transition-colors flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {locationData && (
            <div className="mt-2 border border-line rounded-xl p-3 bg-[#EEF2F6] flex items-center gap-3 relative max-w-full">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs font-bold text-ink truncate leading-tight">{locationData.road || "Shared Location"}</span>
                <span className="text-[10px] font-bold text-primary truncate leading-normal">{locationData.city}</span>
                {locationData.fullAddress && (
                  <span className="text-[9.5px] font-medium text-slate-500 mt-0.5 whitespace-normal leading-normal">{locationData.fullAddress}</span>
                )}
              </div>
              <a 
                href={locationData.mapUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 bg-primary text-white text-[10px] font-extrabold rounded-lg active:scale-95 transition-all flex-shrink-0"
              >
                Open Map
              </a>
            </div>
          )}

          {reactions && (
            <div className="flex items-center gap-2 mt-2">
              {reactions.map((r, i) => (
                <div key={i} className="flex items-center gap-1 bg-surface-alt border border-line px-1.5 py-0.5 rounded-full text-[10px] font-bold text-faint">
                  <span>{r.emoji}</span> {r.count}
                </div>
              ))}
            </div>
          )}

          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[9px] font-bold text-faint">{time}</span>
            {isMe && (
              // WhatsApp-style double tick — blue once the other person has read it.
              <svg
                className={`w-3.5 h-3 flex-shrink-0 ${read ? 'text-sky-500' : 'text-faint'}`}
                viewBox="0 0 20 12"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 6.5l3 3 6-6.5" />
                <path d="M7 6.5l3 3 6-6.5" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalChat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]); // local messages (e.g. upload previews)
  const [newMessage, setNewMessage] = useState('');
  const endRef = useRef(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;

  const [chatPartner, setChatPartner] = useState(() => {
    if (location.state?.user) return location.state.user;
    return null;
  });

  // The other person's last-read timestamp — drives the blue double tick.
  const [otherLastRead, setOtherLastRead] = useState(0);

  useEffect(() => {
    // Always fetch the full public profile so we have the phone number for the
    // contact sheet — the navigation state often only carries name + avatar.
    if (chatPartner?.phone) return;
    if (!chatId || chatId === '1' || chatId === '2' || chatId === '3') return;

    let active = true;
    getUserPublicProfile(chatId)
      .then((res) => {
        if (active && res.data) {
          setChatPartner((prev) => ({ ...(prev || {}), ...res.data }));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch chat partner details:', err);
      });

    return () => { active = false; };
  }, [chatId, chatPartner]);

  // Mark this DM as read on the server (resets unread + records a read marker so
  // the other person's sent ticks turn blue). Returns the OTHER user's last-read
  // time so we can colour our own ticks immediately.
  const markRead = useCallback(() => {
    if (!chatId || chatId === '1' || chatId === '2' || chatId === '3') return;
    api.patch(`/chat/conversations/${chatId}/read`)
      .then((res) => {
        const ts = Number(res?.data?.otherLastRead) || 0;
        if (ts) setOtherLastRead((prev) => Math.max(prev, ts));
      })
      .catch((err) => {
        console.error('Failed to clear unread message count:', err);
      });
  }, [chatId]);

  // Mark read when the chat opens.
  useEffect(() => { markRead(); }, [markRead]);

  // Live read receipts: when the other person reads, turn my ticks blue.
  useEffect(() => {
    if (!chatId || chatId === '1' || chatId === '2' || chatId === '3') return undefined;
    const socket = getChatSocket();
    const onRead = ({ readerId, at }) => {
      if (String(readerId) === String(chatId)) {
        setOtherLastRead((prev) => Math.max(prev, Number(at) || 0));
      }
    };
    socket.on('messages_read', onRead);
    return () => { socket.off('messages_read', onRead); };
  }, [chatId]);

  const activePartner = useMemo(() => {
    if (chatPartner) return chatPartner;

    const mockNames = {
      '1': 'Rohan Sharma',
      '2': 'Neha Singh',
      '3': 'Amit Verma',
    };
    const mockAvatars = {
      '1': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80',
      '2': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
      '3': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
    };

    return {
      name: mockNames[chatId] || 'Chat Partner',
      avatar: mockAvatars[chatId] || getPlaceholderAvatar(mockNames[chatId] || 'Chat Partner'),
    };
  }, [chatId, chatPartner]);

  const dmRoomId = useMemo(() => {
    if (!currentUserId || !chatId) return '';
    const sorted = [String(currentUserId), String(chatId)].sort();
    return `dm-${sorted[0]}-${sorted[1]}`;
  }, [currentUserId, chatId]);

  const { 
    messages: liveMessages, 
    sendMessage: sendLiveMessage, 
    loading, 
    typingUsers, 
    startTyping, 
    stopTyping, 
    onlineStatus,
    deleteMessage: deleteLiveMessage,
    reactMessage: reactLiveMessage
  } = useChat(
    dmRoomId,
    Boolean(dmRoomId),
    chatId
  );

  // Re-mark read whenever a new message arrives from the other person while the
  // chat is open (so their ticks go blue and our unread badge stays at zero).
  useEffect(() => {
    if (!liveMessages || liveMessages.length === 0) return;
    const last = liveMessages[liveMessages.length - 1];
    if (last && currentUserId && String(last.senderId) !== String(currentUserId)) {
      markRead();
    }
  }, [liveMessages, currentUserId, markRead]);

  const displayMessages = useMemo(() => {
    const mapped = (liveMessages || []).map((m) => {
      const isMe = currentUserId && String(m.senderId) === String(currentUserId);
      return {
        id: m.id,
        _ts: m.createdAt,
        avatar: isMe ? (currentUser?.avatar || getPlaceholderAvatar(currentUser?.name || 'You')) : activePartner.avatar,
        name: isMe ? "You" : activePartner.name,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: m.content,
        replyData: m.replyTo ? { name: m.replyTo.name, content: m.replyTo.content } : undefined,
        image: m.image,
        video: m.video,
        documentData: m.documentData,
        locationData: m.locationData,
        voiceData: m.voiceData,
        type: m.type,
        reactions: m.reactions,
        senderId: m.senderId,
        isMe,
        // Blue tick once the other person's last-read time covers this message.
        read: Boolean(isMe && otherLastRead > 0 && Number(m.createdAt) <= otherLastRead),
      };
    });
    const locals = (messages || []).map((m) => ({ ...m, _ts: m._ts ?? m.id }));
    return [...mapped, ...locals].sort((a, b) => (a._ts || 0) - (b._ts || 0));
  }, [liveMessages, messages, currentUserId, activePartner, currentUser, otherLastRead]);

  const typingTimeoutRef = useRef(null);
  const currentUserName = currentUser?.name || 'User';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, typingUsers]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleNewMessageChange = (val) => {
    setNewMessage(val);
    
    if (val.trim()) {
      startTyping(currentUserName);
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCat, setActiveEmojiCat] = useState(0);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Images shared in this conversation, newest first, for the contact sheet.
  const sharedMedia = useMemo(
    () => displayMessages.filter((m) => m.image).map((m) => m.image).reverse(),
    [displayMessages]
  );

  const openProfile = () => {
    setShowHeaderMenu(false);
    setShowProfile(true);
  };

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !dmRoomId) return;
    const replyTo = replyingToMessage
      ? {
          id: String(replyingToMessage.id),
          name: replyingToMessage.name || '',
          content: replyingToMessage.content || '',
        }
      : null;

    // Stop typing indicator on send
    stopTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      await sendLiveMessage(text, replyTo);
      setReplyingToMessage(null);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send DM message:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const fileInputRef = useRef(null);
  const [fileTypeToUpload, setFileTypeToUpload] = useState('image'); // 'image' or 'document'

  const triggerFileUpload = (type) => {
    setFileTypeToUpload(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowAttachmentDrawer(false);

    const tempId = `temp-${Date.now()}`;
    const localUrl = URL.createObjectURL(file);

    if (fileTypeToUpload === 'image') {
      const isVideo = file.type.startsWith('video/');
      
      // Optimistic preview message
      const optMsg = {
        id: tempId,
        _ts: Date.now(),
        name: 'You',
        avatar: currentUser?.avatar || getPlaceholderAvatar(currentUser?.name || 'You'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploading: true,
        content: '',
        isMe: true
      };
      if (isVideo) {
        optMsg.video = localUrl;
      } else {
        optMsg.image = localUrl;
      }
      setMessages(prev => [...prev, optMsg]);

      try {
        const formData = new FormData();
        formData.append('media', file);

        const res = await api.post('/uploads/media?folder=misc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data?.url) {
          if (isVideo) {
            await sendLiveMessage({
              type: 'video',
              video: res.data.url,
              content: ''
            });
            showToast('Video uploaded and shared!', '🎥');
          } else {
            await sendLiveMessage({
              type: 'image',
              image: res.data.url,
              content: ''
            });
            showToast('Image uploaded and shared!', '📸');
          }
        } else {
          showToast('Failed to upload file', '❌');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        showToast(err.response?.data?.message || 'Upload failed', '❌');
      } finally {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        URL.revokeObjectURL(localUrl);
      }
    } else {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      // Optimistic preview document message
      const optMsg = {
        id: tempId,
        _ts: Date.now(),
        name: 'You',
        avatar: currentUser?.avatar || getPlaceholderAvatar(currentUser?.name || 'You'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploading: true,
        documentData: {
          name: file.name,
          size: sizeStr
        },
        content: `Shared a document: ${file.name}`,
        isMe: true
      };
      setMessages(prev => [...prev, optMsg]);

      try {
        const formData = new FormData();
        formData.append('media', file);

        const res = await api.post('/uploads/media?folder=misc', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (res.data?.url) {
          await sendLiveMessage({
            type: 'document',
            documentData: {
              name: file.name,
              size: sizeStr,
              url: res.data.url
            },
            content: `Shared a document: ${file.name}`
          });
          showToast('Document uploaded and shared!', '📄');
        } else {
          showToast('Failed to upload document', '❌');
        }
      } catch (err) {
        console.error('Document upload failed:', err);
        showToast(err.response?.data?.message || 'Document upload failed', '❌');
      } finally {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  const handleShareLocation = () => {
    setShowAttachmentDrawer(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            showToast('Fetching address details...', '📍');
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
              headers: {
                'Accept-Language': 'en'
              }
            });
            const geoData = await geoRes.json();
            const address = geoData.address || {};
            const city = address.city || address.town || address.village || address.suburb || "Mumbai";
            const road = address.road || address.suburb || "Current Location";
            const fullAddress = geoData.display_name || `${road}, ${city}`;
            
            await sendLiveMessage({
              type: 'location',
              locationData: {
                lat: lat.toFixed(4),
                lng: lng.toFixed(4),
                city: city,
                road: road,
                fullAddress: fullAddress,
                mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
              },
              content: `Shared Location: ${fullAddress}`
            });
            showToast('Location shared!', '📍');
          } catch (geoErr) {
            console.error('Failed to reverse geocode location:', geoErr);
            await sendLiveMessage({
              type: 'location',
              locationData: {
                lat: lat.toFixed(4),
                lng: lng.toFixed(4),
                city: "Mumbai",
                road: "Current Location",
                fullAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
                mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
              },
              content: "Shared location 📍"
            });
            showToast('Location shared!', '📍');
          }
        },
        async (err) => {
          console.error('Geolocation error:', err);
          try {
            await sendLiveMessage({
              type: 'location',
              locationData: {
                lat: "19.0760",
                lng: "72.8777",
                city: `Mumbai, India`,
                road: "Pinned Location",
                fullAddress: "Mumbai, Maharashtra, India",
                mapUrl: "https://www.google.com/maps?q=19.0760,72.8777"
              },
              content: "Shared location 📍"
            });
            showToast('Shared default location!', '📍');
          } catch (sendErr) {
            console.error('Failed to send fallback location:', sendErr);
          }
        }
      );
    } else {
      showToast('Geolocation is not supported by your browser.', '❌');
    }
  };

  const handleMessageReaction = async (messageId, emoji) => {
    try {
      if (!dmRoomId || !messageId) return;
      await reactLiveMessage(messageId, emoji);
    } catch (err) {
      console.error('Failed to react to message:', err);
    } finally {
      setSelectedMessageForMenu(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (!dmRoomId || !messageId) return;
      await deleteLiveMessage(messageId);
      showToast('Message deleted', '🗑️');
    } catch (err) {
      console.error('Failed to delete message:', err);
      showToast(err.response?.data?.message || 'Failed to delete message', '❌');
    } finally {
      setSelectedMessageForMenu(null);
    }
  };

  const handleCopyMessage = (content) => {
    if (content) {
      navigator.clipboard.writeText(content);
      const notification = document.createElement('div');
      notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface text-xs font-black px-4 py-2.5 rounded-xl shadow-2xl z-[100] flex items-center gap-2 animate-fadeIn";
      notification.innerHTML = "<span>📋</span> Message copied to clipboard!";
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => notification.remove(), 400);
      }, 2000);
    }
    setSelectedMessageForMenu(null);
  };

  const handleLikeMessage = async (messageId) => {
    try {
      if (!dmRoomId || !messageId) return;
      await reactLiveMessage(messageId, '❤️');
      
      const burst = document.createElement('div');
      burst.className = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-7xl font-bold select-none pointer-events-none z-[100] animate-heartPop";
      burst.innerHTML = "❤️";
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 800);
    } catch (err) {
      console.error('Failed to like message:', err);
    }
  };

  const handleReplyMessage = (msg) => {
    setReplyingToMessage(msg);
    setSelectedMessageForMenu(null);
  };

  const emojiCategories = [
    { 
      name: 'Smileys', 
      icon: '😊', 
      list: ['😊', '😂', '🤣', '🥰', '😍', '🤩', '😘', '😜', '🤪', '😎', '😏', '🤔', '🤫', '🙄', '😬', '😴', '😇', '🥳', '🥺', '😭', '😡', '🤯', '😤', '🥱', '👽', '💀', '💩', '🤡'] 
    },
    { 
      name: 'Gestures', 
      icon: '👍', 
      list: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '🤝', '👏', '🙌', '🙋‍♂️', '🙋‍♀️', '🤦‍♂️', '🤦‍♀️', '🙏', '💪', '👈', '👉', '👆', '👇', '👋', '✍️', '💅'] 
    },
    { 
      name: 'Love & Magic', 
      icon: '❤️', 
      list: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔥', '💯', '✨', '🌟', '⭐', '⚡', '💥', '🎉', '🎈', '🔮'] 
    },
    { 
      name: 'Animals', 
      icon: '🐱', 
      list: ['🐶', '🐱', '🦁', '🐯', '🐼', '🐨', '🦊', '🐵', '🐸', '🦄', '🦅', '🦉', '🐝', '🦋', '🌸', '🌹', '🌻', '🍀', '🍂', '🍄', '🌲', '🌴', '🌈', '☀️', '🌙', '❄️'] 
    },
    { 
      name: 'Food', 
      icon: '🍕', 
      list: ['🍎', '🍌', '🍉', '🍇', '🍓', '🍑', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🍰', '🍫', '🍦', '🍧', '☕', '🍵', '🥤', '🍺'] 
    },
    { 
      name: 'Travel & Objects', 
      icon: '🚀', 
      list: ['🚗', '🚲', '🛵', '🚀', '✈️', '🏢', '🏠', '🏝️', '⛰️', '⌚', '💻', '📱', '📷', '🔋', '💡', '💵', '💳', '📦', '✉️', '✏️', '🔒', '🔑', '🏆', '🎁', '🛍️', '🛒'] 
    }
  ];

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full max-w-[430px] mx-auto bg-[#F6F6F8] relative overflow-hidden">
      <TopBar
        navigate={navigate}
        user={activePartner}
        onlineStatus={onlineStatus}
        onProfileClick={openProfile}
        onMenuToggle={() => setShowHeaderMenu((p) => !p)}
        isMenuOpen={showHeaderMenu}
        onViewContact={openProfile}
      />
      
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar relative pt-4 bg-[#F6F6F8]">
        {loading && displayMessages.length === 0 ? (
          <ChatSkeleton />
        ) : (
          displayMessages.map(msg => (
            <ChatMessage 
              key={msg.id} 
              {...msg} 
              onVote={null} 
              onLongPress={setSelectedMessageForMenu} 
              onLike={handleLikeMessage} 
              onReply={setReplyingToMessage} 
            />
          ))
        )}

        {/* Real-time typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-2 text-[11px] font-bold text-slate-400 bg-surface/50 border border-line-soft rounded-full w-fit mx-4 mb-4 shadow-sm animate-pulse">
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>{typingUsers.map(u => u.userName).join(', ')} is typing...</span>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Bottom input area with sharing & emoji pickers */}
      <div className="absolute bottom-0 left-0 w-full bg-[#F6F6F8] z-40">
        {/* Sharing Options Drawer */}
        {showAttachmentDrawer && (
          <div className="mx-4 mb-2 p-4 bg-surface/80 backdrop-blur-md border border-surface/20 rounded-3xl shadow-xl animate-slideUp z-50">
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[11px] font-extrabold text-ink uppercase tracking-wider">Quick Share</span>
              <button onClick={() => setShowAttachmentDrawer(false)} className="text-muted hover:text-faint">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  label: 'Gallery',
                  gradient: 'from-purple-500 to-indigo-600',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  action: () => triggerFileUpload('image')
                },
                {
                  label: 'Camera',
                  gradient: 'from-pink-500 to-rose-600',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  action: () => triggerFileUpload('image')
                },
                {
                  label: 'Location',
                  gradient: 'from-amber-500 to-orange-600',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  action: () => handleShareLocation()
                },
                {
                  label: 'Document',
                  gradient: 'from-blue-500 to-cyan-600',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  action: () => triggerFileUpload('document')
                }
              ].map((opt, i) => (
                <button 
                  key={i} 
                  onClick={opt.action}
                  className="flex flex-col items-center gap-1 active:scale-95 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${opt.gradient} flex items-center justify-center shadow-md shadow-slate-300 group-hover:scale-105 transition-transform duration-200`}>
                    {opt.icon}
                  </div>
                  <span className="text-[9px] font-bold text-faint text-center tracking-tight truncate w-full">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji Picker Drawer */}
        {showEmojiPicker && (
          <div className="mx-4 mb-2 p-3.5 bg-surface/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl animate-slideUp z-50 flex flex-col gap-2.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-black text-ink uppercase tracking-wider">Emojis</span>
              <button onClick={() => setShowEmojiPicker(false)} className="text-muted hover:text-faint transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex gap-1 border-b border-line pb-2 overflow-x-auto no-scrollbar">
              {emojiCategories.map((cat, idx) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveEmojiCat(idx)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 flex-shrink-0 ${
                    activeEmojiCat === idx 
                      ? 'bg-primary-soft text-primary font-black scale-105' 
                      : 'text-muted hover:bg-surface-alt'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-[9.5px] tracking-tight">{cat.name}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar py-1">
              {emojiCategories[activeEmojiCat].list.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    const nextVal = newMessage + emoji;
                    handleNewMessageChange(nextVal);
                  }}
                  className="w-10 h-10 text-2xl flex items-center justify-center rounded-xl hover:bg-surface-alt active:scale-75 transition-all duration-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Replying Preview Bar */}
        {replyingToMessage && (
          <div className="mx-4 mb-1.5 p-3 bg-surface border border-line rounded-2xl flex items-center justify-between shadow-sm animate-slideUp">
            <div className="flex items-center gap-2 border-l-[3px] border-primary pl-2 min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black text-primary">Replying to {replyingToMessage.name}</span>
                <span className="text-[11px] font-semibold text-muted truncate">{replyingToMessage.content}</span>
              </div>
            </div>
            <button 
              onClick={() => setReplyingToMessage(null)}
              className="p-1 text-faint hover:text-ink hover:bg-surface-alt rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="px-4 py-3 bg-transparent">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-surface rounded-full border border-slate-200/90 shadow-sm px-3.5 py-2.5 flex items-center gap-2.5">
              <button 
                onClick={() => { setShowEmojiPicker(prev => !prev); setShowAttachmentDrawer(false); }}
                className={`active:scale-95 transition-all text-muted hover:text-primary ${showEmojiPicker ? 'text-primary' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => handleNewMessageChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-muted/70 outline-none border-none"
              />

              <button 
                onClick={() => { setShowAttachmentDrawer(prev => !prev); setShowEmojiPicker(false); }}
                className={`active:scale-95 transition-all text-muted hover:text-primary ${showAttachmentDrawer ? 'text-primary' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0 ${
                newMessage.trim() 
                  ? 'bg-primary text-white active:scale-90 hover:bg-primary-deep' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 rotate-45 -translate-x-[1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={fileTypeToUpload === 'image' ? 'image/*,video/*' : '.pdf,.doc,.docx,.txt'} 
      />

      {/* Message Options Drawer */}
      {selectedMessageForMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedMessageForMenu(null)}>
          <div 
            className="w-full max-w-[430px] bg-surface/90 backdrop-blur-md border-t border-line rounded-t-3xl shadow-2xl p-5 animate-slideUp flex flex-col gap-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1"></div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-faint uppercase tracking-wider px-1">Quick React</span>
              <div className="flex justify-between items-center bg-surface-alt/80 rounded-2xl p-2.5 border border-line">
                {['👍', '❤️', '😂', '🔥', '💯', '🥺'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => handleMessageReaction(selectedMessageForMenu.id, emoji)}
                    className="text-2xl hover:scale-125 active:scale-90 transition-transform duration-200"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col bg-surface-alt/60 rounded-2xl border border-line overflow-hidden">
              <button
                onClick={() => handleReplyMessage(selectedMessageForMenu)}
                className="w-full px-4 py-3.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-3 transition-colors border-b border-line"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Reply to Message</span>
              </button>

              <button
                onClick={() => handleCopyMessage(selectedMessageForMenu.content)}
                className="w-full px-4 py-3.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-3 transition-colors border-b border-line"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy Message Text</span>
              </button>
              
              {selectedMessageForMenu && selectedMessageForMenu.name === 'You' && (
                <button
                  onClick={() => handleDeleteMessage(selectedMessageForMenu.id)}
                  className="w-full px-4 py-3.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Message</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedMessageForMenu(null)}
              className="w-full py-3.5 bg-surface border border-line rounded-2xl font-black text-xs text-ink active:scale-95 transition-all text-center shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Contact Profile Sheet (WhatsApp-style) */}
      <ContactProfile
        open={showProfile}
        onClose={() => setShowProfile(false)}
        profile={activePartner}
        sharedMedia={sharedMedia}
      />
    </div>
  );
};

export default PersonalChat;
