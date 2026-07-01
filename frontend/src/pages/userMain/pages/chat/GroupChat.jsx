import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useChat } from '../../hooks/useChat';
import { showToast } from '../../../../utils/toast';
import { getGroup, joinGroup, leaveGroup, kickGroupMember } from '../../../../services/group.api';
import { votePollMessage, pinMessage, unpinMessage, reactMessage, deleteMessage } from '../../../../services/chat.api';
import { createTicket } from '../../../../services/ticket.api';
import api from '../../../../services/api';
import { captureCameraPhoto } from '../../../../utils/captureImage';
import ContactProfile from './ContactProfile';

const getPlaceholderAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff`;

// --- Dummy Data & State Init ---
const initialMessages = [
  {
    id: 1,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
    name: "Rohan Sharma",
    role: "Admin",
    time: "10:30 AM",
    content: "Hey everyone! Our target is to get the price under ₹72,000. Invite more people to reach the minimum quantity.",
    reactions: [{ emoji: '👍', count: 12 }, { emoji: '🔥', count: 5 }]
  },
  {
    id: 2,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    name: "Neha Singh",
    time: "10:32 AM",
    content: "Can anyone suggest a reliable vendor?",
    replyData: {
      name: "Rohan Sharma",
      content: "Hey everyone! Our target is to get the price under ₹72,000."
    }
  },
  {
    id: 3,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
    name: "Amit Verma",
    time: "10:35 AM",
    content: "Vendor A is offering 8% off if we reach 50 units.",
    reactions: [{ emoji: '👍', count: 10 }, { emoji: '💯', count: 4 }],
    quoteData: {
      vendor: 'TechDealz Solutions',
      price: '₹69,999',
      discount: '8% OFF',
      qty: '50 Units',
      delivery: '2-3 Days',
      warranty: '1 Year'
    }
  },
  {
    id: 4,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    name: "Priya Mehta",
    time: "10:38 AM",
    content: "Which color are you all preferring?",
    quoteData: { 
      isPoll: true,
      question: "Which color do you prefer?",
      options: [
        { label: "Natural Titanium", votes: 12, percentage: 60, color: "bg-primary", selected: true },
        { label: "Blue Titanium", votes: 5, percentage: 25, color: "bg-primary opacity-50", selected: false },
        { label: "White Titanium", votes: 3, percentage: 15, color: "bg-primary opacity-50", selected: false }
      ],
      totalVotes: 20
    }
  },
  {
    id: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80",
    name: "Amit Verma",
    time: "10:45 AM",
    content: "Here are some reference images from the supplier.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
  }
];

// --- Subcomponents ---

const TopBar = ({ navigate, group, onMenuToggle, onShare }) => (
  <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-line sticky top-0 z-30 w-full gap-2">
    <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
      <button onClick={() => navigate(-1)} className="p-1 active:scale-95 transition-all flex-shrink-0 text-ink hover:bg-surface-alt rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="w-9 h-9 bg-surface-alt rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-line">
        <img src={group.image} alt="Product" className="w-full h-full object-contain " />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1.5 w-full">
          <h1 className="text-[13.5px] font-black text-ink truncate leading-tight flex-shrink min-w-0">
            {group.title || 'Group Chat'}
          </h1>
          <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded flex-shrink-0 leading-none ${(group.status || 'active') === 'closing' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-green-50 text-green-600'}`}>
            {group.status || 'ACTIVE'}
          </span>
        </div>
        <p className="text-[10px] font-bold text-muted mt-0.5 truncate leading-none">
          {group.category || 'General'} • {group.location || 'Local'}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1 flex-shrink-0">
      <button onClick={onShare} className="p-2 active:scale-95 transition-all text-faint hover:bg-surface-alt rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      <button onClick={onMenuToggle} className="p-2 active:scale-95 transition-all text-faint hover:bg-surface-alt rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </button>
    </div>
  </div>
);

const JoinedInfo = ({ group }) => {
  const spotsJoined = group.spotsJoined ?? group.joined ?? 0;
  const spotsTotal = group.spotsTotal ?? (spotsJoined + (group.needed || 0));
  
  return (
    <div className="flex items-center gap-3 px-4 pb-4 bg-surface">
      <div className="flex -space-x-2">
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-surface object-cover bg-surface-alt" />
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-surface object-cover bg-surface-alt" />
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=40&q=80" alt="User" className="w-7 h-7 rounded-full border-2 border-surface object-cover bg-surface-alt" />
        <div className="w-7 h-7 rounded-full border-2 border-surface bg-surface-alt flex items-center justify-center text-[10px] font-bold text-faint">+{Math.max(spotsJoined - 3, 0)}</div>
      </div>
      <span className="text-[12px] font-semibold text-faint">{spotsJoined} / {spotsTotal} buyers joined</span>
    </div>
  );
};

const StatsCard = ({ group }) => {
  const spotsJoined = group.spotsJoined ?? group.joined ?? 0;
  const spotsTotal = group.spotsTotal ?? (spotsJoined + (group.needed || 0));
  const percentage = Math.round((spotsJoined / spotsTotal) * 100) || 0;
  const daysLeftStr = group.daysLeft || 'TBD';
  const status = group.status || 'active';
  
  return (
    <div className="px-4 pb-4 bg-surface">
      <div className="bg-surface border border-line rounded-2xl p-4 shadow-sm shadow-card">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-4">
            <p className="text-[11px] font-extrabold text-ink mb-2">Let's reach {spotsTotal} buyers and get the best deal!</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-primary">{percentage}%</span>
            </div>
          </div>
          <div className="pl-4 border-l border-line flex flex-col items-center justify-center font-bold">
            <span className="text-[9px] font-semibold text-primary mb-1">{status === 'closing' ? 'Closing in' : 'Deal closes in'}</span>
            <span className="text-[11px] font-black text-primary tracking-tight">{daysLeftStr.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line mt-1">
          <div className="flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-[11px] font-black text-ink">{spotsJoined}</span>
            <span className="text-[9px] font-medium text-faint">Buyers</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-line/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[11px] font-black text-ink">{spotsJoined}</span>
            <span className="text-[9px] font-medium text-faint">Units</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center border-l border-line/60">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1" />
            </svg>
            <span className="text-[11px] font-black text-ink">{spotsTotal}</span>
            <span className="text-[9px] font-medium text-faint">Target</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabsAndPinned = ({ activeTab, setActiveTab, group, pinnedMessage, onPinClick }) => {
  const tabs = ['Chat', 'Polls', 'Members', 'Media'];
  
  return (
    <div className="bg-surface">
      {/* Tabs */}
      <div className="flex items-center justify-between px-4 border-b border-line-soft overflow-x-auto no-scrollbar">
        {tabs.map((tab, idx) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 pt-1 px-2 text-[12px] font-bold flex flex-col items-center gap-1.5 relative whitespace-nowrap active:scale-95 transition-all ${activeTab === tab ? 'text-primary' : 'text-faint'}`}
          >
            {idx === 0 && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            )}
            {idx === 1 && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            {idx === 2 && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            {idx === 3 && <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full transition-all"></div>}
          </button>
        ))}
      </div>

      {/* Pinned Message */}
      <div onClick={onPinClick} className="px-4 py-3 bg-primary-soft cursor-pointer hover:bg-primary/20 transition-colors active:scale-[0.99]">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <p className="text-[11px] font-semibold text-ink flex-1 truncate">
            <span className="text-primary font-bold">Pinned:</span> {pinnedMessage ? pinnedMessage.content : (group.targetPrice ? `Target price ${group.targetPrice} & min ${group.spotsTotal} units to order` : group.slogan)}
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const ChatMessage = ({ id, avatar, name, role, time, content, image, video, reactions, replyTo, quoteData, onVote, documentData, locationData, voiceData, onLongPress, replyData, onLike, onReply, uploading }) => {
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

  return (
    <div
      className="flex gap-2.5 mb-5 px-4 w-full select-none cursor-pointer active:opacity-95 transition-opacity"
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleMove}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-slate-200 mt-1" />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-bold text-ink">{name}</span>
          {role && <span className="text-[8.5px] font-extrabold text-green-600 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{role}</span>}
        </div>
        
        <div className="bg-surface rounded-[14px] rounded-tl-sm p-3 shadow-sm border border-line relative max-w-full">
          {replyData && (
            <div className="mb-2 bg-surface-alt border-l-[3px] border-primary px-2.5 py-1.5 rounded-r-xl text-left text-[11px] leading-tight select-none">
              <span className="block font-black text-primary mb-0.5">{replyData.name}</span>
              <span className="text-muted line-clamp-1">{replyData.content}</span>
            </div>
          )}

          {replyTo && !replyData && (
            <div className="mb-2 text-[11px] font-bold text-primary active:scale-95 transition-all w-fit cursor-pointer">
              Reply
            </div>
          )}
          
          {content && <p className="text-[12px] text-ink leading-relaxed break-words whitespace-pre-wrap">{content}</p>}

          {image && (
            <div
              onClick={(e) => { e.stopPropagation(); if (!uploading) window.open(image, '_blank', 'noopener'); }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="mt-2 rounded-xl overflow-hidden border border-line cursor-pointer active:scale-[0.98] transition-all relative"
            >
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

          {voiceData && (
            <div className="mt-2 border border-line rounded-xl p-3 bg-surface flex items-center gap-3 relative max-w-full">
              <button className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current translate-x-[0.5px]" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex-1 flex items-center gap-0.5 h-6">
                {[4, 8, 2, 9, 6, 12, 4, 7, 3, 10, 5, 8, 3, 6, 9, 2, 7, 4, 11, 3].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary/20 rounded-full" 
                    style={{ height: `${h * 1.5}px` }}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-muted flex-shrink-0">{voiceData.duration}</span>
            </div>
          )}

          {quoteData && !quoteData.isPoll && (
            <div className="mt-2 border border-line rounded-xl p-2.5 bg-[#FDFDFD] flex flex-col gap-2 relative">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-900 rounded-full flex items-center justify-center font-bold text-white text-xs flex-shrink-0">A</div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-ink truncate">{quoteData.vendor}</span>
                  <span className="text-[9px] font-bold text-green-600 flex items-center gap-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Verified
                  </span>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-[12px] font-black text-ink">{quoteData.price}</span>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 rounded">{quoteData.discount}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[9px] font-semibold text-faint">
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> Min. Qty: {quoteData.qty}</span>
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Delivery: {quoteData.delivery}</span>
                <span className="flex items-center gap-1 text-green-600"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Warranty: {quoteData.warranty}</span>
              </div>
            </div>
          )}

          {quoteData?.isPoll && (
            <div className="mt-2 border border-line rounded-xl p-3 bg-[#FDFDFD]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold text-ink pr-2">{quoteData.question}</span>
                <span onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} className="text-[10px] font-bold text-primary whitespace-nowrap cursor-pointer active:scale-95">View Poll</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {quoteData.options.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); onVote && onVote(id, idx); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="flex flex-col gap-1 cursor-pointer group"
                  >
                    <div className={`flex items-center gap-2 text-[10.5px] ${opt.selected ? 'font-bold text-ink' : 'font-semibold text-faint'}`}>
                      {opt.selected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-[1.5px] border-slate-300 group-hover:border-primary transition-colors"></div>
                      )}
                      <span className="flex-1">{opt.label}</span>
                      <span>{opt.percentage}%</span>
                    </div>
                    <div className="w-full h-[3px] bg-surface-alt rounded-full ml-6 w-[calc(100%-24px)] overflow-hidden">
                      <div className={`h-full ${opt.color} transition-all duration-500`} style={{ width: `${opt.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[9px] font-bold text-primary mt-3">{quoteData.totalVotes} votes</div>
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

          <span className="absolute bottom-2.5 right-3 text-[8.5px] font-bold text-faint">{time}</span>
        </div>
      </div>
    </div>
  );
};

const ChatFeed = ({ messages, loading, typingUsers = [], onVote, onLongPress, onLike, onReply }) => {
  const endRef = useRef(null);
  const prevLenRef = useRef(0);

  useEffect(() => {
    const firstLoad = prevLenRef.current === 0;
    const grew = messages.length > prevLenRef.current;
    // Only auto-scroll when a NEW message arrives (not when an existing one is
    // edited, e.g. a like/reaction). First load jumps instantly to the bottom
    // instead of animating a long smooth scroll.
    if (grew || typingUsers.length > 0) {
      endRef.current?.scrollIntoView({ behavior: firstLoad ? 'auto' : 'smooth' });
    }
    prevLenRef.current = messages.length;
  }, [messages, typingUsers]);

  return (
    <div className="bg-[#F6F6F8] pt-5 w-full max-w-[430px] mx-auto pb-4">
      {loading && messages.length === 0 ? (
        <div className="flex flex-col gap-5 px-4 py-2 w-full animate-pulse">
          {[1, 2, 3].map((i) => {
            const isLeft = i % 2 !== 0;
            return (
              <div key={i} className={`flex gap-3 w-full ${isLeft ? '' : 'flex-row-reverse'}`}>
                {isLeft && <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />}
                <div className={`flex flex-col gap-1.5 max-w-[70%] ${isLeft ? 'items-start' : 'items-end'}`}>
                  {isLeft && <div className="w-24 h-3 bg-slate-200 rounded-full" />}
                  <div className={`h-12 bg-slate-200 rounded-[14px] w-48 ${isLeft ? 'rounded-tl-sm' : 'rounded-tr-sm'}`} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        messages.map(msg => (
          <ChatMessage key={msg.id} {...msg} onVote={onVote} onLongPress={onLongPress} onLike={onLike} onReply={onReply} />
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
          <span>{typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

const PollsFeed = ({ messages, onCreatePoll, onVote, onLongPress, onLike, onReply }) => {
  const pollMessages = messages.filter(m => m.quoteData?.isPoll);

  return (
    <div className="bg-[#F6F6F8] pt-5 w-full max-w-[430px] mx-auto pb-4 min-h-[300px]">
      <div className="flex justify-between items-center px-4 mb-4">
        <h3 className="text-sm font-bold text-ink">Active Polls ({pollMessages.length})</h3>
        <button 
          onClick={onCreatePoll}
          className="text-xs font-bold text-primary flex items-center gap-1 active:scale-95 transition-all bg-surface px-3 py-1.5 rounded-lg border border-primary/20 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Poll
        </button>
      </div>
      
      {pollMessages.length > 0 ? (
        pollMessages.map(msg => <ChatMessage key={msg.id} {...msg} onVote={onVote} onLongPress={onLongPress} onLike={onLike} onReply={onReply} />)
      ) : (
        <div className="text-center mt-10">
          <p className="text-sm text-faint font-medium">No polls available.</p>
        </div>
      )}
    </div>
  );
};

const MembersFeed = ({ groupId, isAdmin, members = [], confirmedMembers = [], onRemoveMember, onViewProfile }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all' or 'confirmed'

  const handleDeleteMember = (memberId) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    }
  };

  return (
    <div className="bg-surface pt-2 w-full max-w-[430px] mx-auto pb-4 min-h-[300px]">
      <div className="px-4 py-3 flex gap-2">
        <button 
          onClick={() => setFilter('all')} 
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${filter === 'all' ? 'bg-primary text-white shadow-sm shadow-[#0D9488]/20' : 'bg-surface-alt text-faint hover:bg-surface-alt hover:text-ink'}`}
        >
          All Members ({members.length})
        </button>
        <button 
          onClick={() => setFilter('confirmed')} 
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${filter === 'confirmed' ? 'bg-primary text-white shadow-sm shadow-[#0D9488]/20' : 'bg-surface-alt text-faint hover:bg-surface-alt hover:text-ink'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Confirmed ({confirmedMembers.length})
        </button>
      </div>

      <div className="flex flex-col">
        {filter === 'confirmed' ? (
          confirmedMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between px-4 py-3.5 border-b border-line hover:bg-surface-alt/50 transition-colors animate-fadeIn">
              <button onClick={() => onViewProfile && onViewProfile(member)} className="flex items-center gap-3 min-w-0 text-left active:opacity-80 transition-opacity">
                <div className="relative">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border border-surface">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ink truncate">{member.name}</span>
                    <span className="text-[9px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">{member.badge}</span>
                  </div>
                  <span className="text-xs font-semibold text-faint mt-0.5">{member.units} {member.units > 1 ? 'Units' : 'Unit'}</span>
                </div>
              </button>
              <div className="flex items-center gap-2">
                {isAdmin && member.name !== "You" && (
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95 ml-1"
                    title="Remove Member"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          members.map(member => {
            // Status color mapping
            const statusColors = {
              'Exploring': 'text-slate-500 bg-slate-100',
              'Interested': 'text-blue-600 bg-blue-50',
              'Serious': 'text-amber-600 bg-amber-50',
              'Ready to Buy': 'text-emerald-600 bg-emerald-50'
            };
            const statusColor = statusColors[member.buyStatus] || statusColors['Exploring'];
            return (
              <div key={member.id} className="flex items-center justify-between px-4 py-3 border-b border-line hover:bg-surface-alt/50 transition-colors">
                <button onClick={() => onViewProfile && onViewProfile(member)} className="flex items-center gap-3 min-w-0 text-left active:opacity-80 transition-opacity">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover bg-slate-200 flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink truncate">{member.name}</span>
                      {member.role === 'Admin' && <span className="text-[9px] font-extrabold text-green-600 bg-green-100 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">Admin</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-medium text-faint truncate">{member.number}</span>
                      {member.buyStatus && (
                        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${statusColor}`}>
                          {member.buyStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => navigate(`/messages/${member.id}`, { state: { user: { id: member.id, name: member.name, avatar: member.avatar } } })}
                    className="p-2 text-muted hover:text-primary transition-colors active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </button>
                  {isAdmin && member.name !== "You" && (
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors active:scale-95"
                      title="Remove Member"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const MediaFeed = ({ messages }) => {
  const chatMedia = messages.filter(m => m.image).map(m => m.image);

  return (
    <div className="bg-surface pt-4 w-full max-w-[430px] mx-auto pb-4 min-h-[300px]">
      <div className="px-4 mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink mb-1">Shared Media ({chatMedia.length})</h3>
      </div>
      {chatMedia.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 px-1">
          {chatMedia.map((img, idx) => (
            <div key={idx} className="aspect-square bg-surface-alt rounded-sm overflow-hidden cursor-pointer active:scale-95 transition-all group relative">
              <img src={img} alt={`Media ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <p className="text-sm text-faint font-medium">No shared media yet.</p>
        </div>
      )}
    </div>
  );
};

// --- Modals ---

const CreatePollModal = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (options.length < 5) setOptions([...options, '']);
  };

  const handleOptionChange = (idx, val) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if(!question.trim() || options.some(o => !o.trim())) return;
    // Reject duplicate options (case-insensitive).
    const normalized = options.map(o => o.trim().toLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      showToast('Poll options must be unique.', '⚠️');
      return;
    }
    onSubmit(question, options);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl w-full max-w-[360px] p-5 shadow-2xl overflow-hidden flex flex-col scale-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-extrabold text-ink">Create Poll</h2>
          <button onClick={onClose} className="p-1 text-faint hover:bg-surface-alt rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-faint uppercase tracking-wider">Question</label>
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..." 
              className="w-full bg-[#F6F6F8] text-sm font-medium text-ink placeholder:text-muted rounded-xl px-4 py-3 outline-none border border-transparent focus:border-primary/30 focus:bg-surface transition-all"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-bold text-faint uppercase tracking-wider">Options</label>
            {options.map((opt, idx) => (
              <input 
                key={idx}
                type="text" 
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`} 
                className="w-full bg-[#F6F6F8] text-sm font-medium text-ink placeholder:text-muted rounded-xl px-4 py-2.5 outline-none border border-transparent focus:border-primary/30 focus:bg-surface transition-all"
              />
            ))}
            
            {options.length < 5 && (
              <button onClick={handleAddOption} className="text-[12px] font-bold text-primary py-2 flex items-center justify-center gap-1 active:scale-95 transition-all bg-primary/5 rounded-xl border border-dashed border-primary/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Option
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="mt-6 w-full bg-primary text-white font-bold text-sm py-3.5 rounded-xl active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
          disabled={!question.trim() || options.some(o => !o.trim())}
        >
          Create Poll
        </button>
      </div>
    </div>
  );
};

const EditInterestModal = ({ currentInterest, onClose, onSave }) => {
  const [val, setVal] = useState(currentInterest);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl w-full max-w-[320px] p-5 shadow-2xl">
        <h2 className="text-lg font-extrabold text-ink mb-4">Edit Your Interest</h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setVal(Math.max(1, val - 1))} className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-ink text-xl font-bold active:scale-95 border border-line">-</button>
          <span className="text-3xl font-black text-ink w-12 text-center">{val}</span>
          <button onClick={() => setVal(val + 1)} className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-ink text-xl font-bold active:scale-95 border border-line">+</button>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-faint bg-surface-alt border border-line active:scale-95 transition-all">Cancel</button>
          <button onClick={() => onSave(val)} className="flex-1 py-3 rounded-xl font-bold text-white bg-primary shadow-md shadow-primary/20 active:scale-95 transition-all">Save</button>
        </div>
      </div>
    </div>
  );
};

const PinnedMessageModal = ({ group, pinnedMessage, onUnpin, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl w-full max-w-[340px] p-5 shadow-2xl relative border border-line">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-faint hover:bg-surface-alt rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        {pinnedMessage ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              <h2 className="text-lg font-extrabold text-ink">Pinned Message</h2>
            </div>
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-4 mb-4">
              <span className="block font-black text-primary text-[11px] mb-1">{pinnedMessage.senderName}</span>
              <p className="text-sm font-semibold text-ink leading-relaxed break-words whitespace-pre-wrap">
                {pinnedMessage.content}
              </p>
              <span className="block text-[9px] text-faint mt-2">{new Date(pinnedMessage.createdAt).toLocaleString()}</span>
            </div>
            
            {onUnpin && (
              <button 
                onClick={onUnpin}
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Unpin Message
              </button>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              <h2 className="text-lg font-extrabold text-ink">Pinned Information</h2>
            </div>
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-4 mb-2">
              <p className="text-sm font-semibold text-ink leading-relaxed mb-3">
                <span className="text-primary font-bold">Goal:</span> {group.targetPrice ? `Reach target price of ${group.targetPrice} by ordering a min. of ${group.spotsTotal} units together.` : group.slogan}
              </p>
              <div className="flex flex-col gap-2.5 text-[11px] font-bold text-faint">
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Deadline:</span><span className="text-ink text-sm font-black">{group.daysLeft}</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> Buyers Joined:</span><span className="text-ink text-sm font-black">{group.spotsJoined}/{group.spotsTotal}</span></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Screen Skeleton Component ---
const GroupChatSkeleton = () => (
  <div className="flex flex-col h-screen h-[100dvh] w-full max-w-[430px] mx-auto bg-[#F6F6F8] relative overflow-hidden animate-pulse">
    {/* Header Placeholder */}
    <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-line w-full gap-2 h-[56px]">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-6 h-6 bg-slate-200 rounded-full" />
        <div className="w-9 h-9 bg-slate-200 rounded-xl" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="w-32 h-3.5 bg-slate-200 rounded-full" />
          <div className="w-20 h-2 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>

    {/* Joined Info & Stats Card Placeholder */}
    <div className="flex flex-col gap-3 p-4 bg-surface border-b border-line">
      <div className="w-48 h-3 bg-slate-200 rounded-full" />
      <div className="bg-surface border border-line rounded-2xl p-4 h-[120px] flex flex-col justify-between">
        <div className="w-full h-4 bg-slate-200 rounded-full" />
        <div className="w-full h-2 bg-slate-200 rounded-full" />
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-line">
          <div className="h-8 bg-slate-200 rounded-lg" />
          <div className="h-8 bg-slate-200 rounded-lg" />
          <div className="h-8 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Tabs Placeholder */}
    <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-line">
      <div className="w-16 h-4 bg-slate-200 rounded-full" />
      <div className="w-16 h-4 bg-slate-200 rounded-full" />
      <div className="w-16 h-4 bg-slate-200 rounded-full" />
      <div className="w-16 h-4 bg-slate-200 rounded-full" />
    </div>

    {/* Chat Feed Placeholder */}
    <div className="flex-1 flex flex-col gap-5 px-4 py-6 overflow-y-hidden bg-[#F6F6F8]">
      {[1, 2, 3].map((i) => {
        const isLeft = i % 2 !== 0;
        return (
          <div key={i} className={`flex gap-3 w-full ${isLeft ? '' : 'flex-row-reverse'}`}>
            {isLeft && <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />}
            <div className={`flex flex-col gap-1.5 max-w-[70%] ${isLeft ? 'items-start' : 'items-end'}`}>
              {isLeft && <div className="w-24 h-3 bg-slate-200 rounded-full" />}
              <div className={`h-12 bg-slate-200 rounded-[14px] w-48 ${isLeft ? 'rounded-tl-sm' : 'rounded-tr-sm'}`} />
            </div>
          </div>
        );
      })}
    </div>

    {/* Bottom Input Area Placeholder */}
    <div className="p-4 bg-surface border-t border-line h-[72px] flex items-center gap-2">
      <div className="flex-1 h-10 bg-slate-200 rounded-full" />
      <div className="w-10 h-10 bg-slate-200 rounded-full" />
    </div>
  </div>
);

// --- Main Page Component ---

const ReportModal = ({ title, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    await onSubmit(reason.trim());
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface rounded-3xl w-full max-w-[340px] p-5 shadow-2xl border border-line">
        <h2 className="text-[16px] font-black text-ink mb-2">{title}</h2>
        <p className="text-[11px] text-muted font-bold mb-4">Please describe the reason for reporting this. Our moderation team will review it.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type your reason here..."
            rows={3}
            required
            className="w-full p-3 text-[12px] font-medium text-ink placeholder:text-muted/60 bg-surface-alt border border-slate-200/90 rounded-2xl outline-none focus:border-primary transition-all resize-none"
            maxLength={1000}
          />
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-xs text-faint bg-surface-alt border border-line active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-primary shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const groupDetailsCache = {};

const GroupChat = () => {
  const navigate = useNavigate();
  const { groupId } = useParams(); 
  const location = useLocation();
  
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id || currentUser?.id;
  
  const [groupState, setGroupState] = useState(() => location.state?.group || groupDetailsCache[groupId] || null);
  const [loading, setLoading] = useState(() => !location.state?.group && !groupDetailsCache[groupId]);

  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      try {
        if (!groupId) return;

        const res = await getGroup(groupId);
        if (active && res?.data) {
          setGroupState(res.data);
          groupDetailsCache[groupId] = res.data;

          const userId = currentUser?._id || currentUser?.id;
          const membersList = res.data.members || [];
          const isUserMember = membersList.some(m => String(m._id || m.id || m) === String(userId));
          const isUserAdmin = res.data.admin && String(res.data.admin._id || res.data.admin.id || res.data.admin) === String(userId);

          if (!isUserMember && !isUserAdmin) {
            showToast('You must join the group to view the chat.', '🔒');
            navigate(`/groups/${groupId}`, { replace: true });
          }
        }
      } catch (err) {
        console.error('Failed to fetch group details:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetails();
    return () => { active = false; };
  }, [groupId, currentUser, navigate]);

  const group = useMemo(() => {
    if (!groupState) {
      return {
        id: groupId || 'g-fallback',
        title: 'Loading...',
        status: 'active',
        category: 'General',
        location: 'Local',
        slogan: 'Loading group details...',
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80',
        spotsJoined: 0,
        spotsTotal: 10,
        daysLeft: '—',
        targetPrice: 'TBD',
        bestOffer: 'TBD',
        myInterest: '1 Unit'
      };
    }
    const spotsJoined = groupState.spotsJoined ?? (Array.isArray(groupState.members) ? groupState.members.length : 0);
    const spotsTotal = groupState.spotsTotal ?? 10;
    const targetPrice = groupState.targetPrice || `Under ₹${(spotsTotal * 1000).toLocaleString()}`;
    const bestOffer = groupState.bestOffer || `₹${Math.round(spotsTotal * 900).toLocaleString()} (10% OFF)`;
    const myInterest = groupState.myInterest || '1 Unit';
    const daysLeft = groupState.daysLeft || '—';
    return {
      ...groupState,
      spotsJoined,
      spotsTotal,
      targetPrice,
      bestOffer,
      myInterest,
      daysLeft
    };
  }, [groupState, groupId]);

  const resolvedGroupId = group.id || groupId || 'g-fallback';

  const [activeTab, setActiveTab] = useState('Chat');
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (resolvedGroupId) {
      setIsPinned(localStorage.getItem(`buytogether_pinned_group_${resolvedGroupId}`) === 'true');
      setIsMuted(localStorage.getItem(`buytogether_muted_group_${resolvedGroupId}`) === 'true');
    }
  }, [resolvedGroupId]);
  // `messages` holds client-only items (polls, in-session file shares). Real
  // text chat comes from Firebase RTDB via the useChat hook and is merged below.
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showPollModal, setShowPollModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const typingTimeoutRef = useRef(null);
  const currentUserName = currentUser?.name || 'User';

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleNewMessageChange = (val) => {
    setMessageInput(val);
    
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
  const { isJoined, isAdmin } = useMemo(() => {
    const adminId = groupState?.admin?._id || groupState?.admin?.id || groupState?.admin;
    const userIsAdmin = adminId && currentUserId && String(adminId) === String(currentUserId);
    const userIsMember = groupState?.members?.some(m => String(m._id || m.id || m) === String(currentUserId));
    return {
      isJoined: !!userIsMember || !!userIsAdmin,
      isAdmin: !!userIsAdmin,
    };
  }, [groupState, currentUserId]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Premium Upgraded states
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCat, setActiveEmojiCat] = useState(0);

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
  

  // ── Realtime chat (Firebase RTDB via backend) ──────────────────────
  const { 
    messages: liveMessages, 
    sendMessage: sendLiveMessage, 
    loading: chatLoading,
    typingUsers,
    pinnedMessage,
    startTyping,
    stopTyping,
    deleteMessage: deleteLiveMessage,
    reactMessage: reactLiveMessage
  } = useChat(resolvedGroupId, isJoined);

  // Merge live RTDB text messages with client-only items (polls, files),
  // mapping each live message into the shape <ChatMessage /> expects.
  const displayMessages = useMemo(() => {
    const mapped = (liveMessages || []).map((m) => {
      const isMe = currentUserId && String(m.senderId) === String(currentUserId);
      
      let quoteData = m.quoteData;
      if (m.type === 'poll' && quoteData && quoteData.isPoll) {
        const votesMap = quoteData.votesMap || {};
        const totalVotes = Object.keys(votesMap).length;
        const options = (quoteData.options || []).map((opt, idx) => {
          const votes = Object.values(votesMap).filter(v => v === idx).length;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const selected = currentUserId && votesMap[currentUserId] === idx;
          const color = selected ? "bg-primary" : "bg-primary opacity-50";
          return {
            ...opt,
            votes,
            percentage,
            selected,
            color
          };
        });
        quoteData = {
          ...quoteData,
          options,
          totalVotes
        };
      }

      return {
        id: m.id,
        _ts: m.createdAt,
        name: isMe ? 'You' : m.senderName,
        avatar: isMe ? (currentUser?.avatar || getPlaceholderAvatar(currentUser?.name || 'You')) : (m.senderAvatar || getPlaceholderAvatar(m.senderName)),
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: m.content,
        replyData: m.replyTo ? { name: m.replyTo.name, content: m.replyTo.content } : undefined,
        image: m.image,
        video: m.video,
        documentData: m.documentData,
        locationData: m.locationData,
        voiceData: m.voiceData,
        type: m.type,
        quoteData,
        reactions: m.reactions,
        senderId: m.senderId,
      };
    });
    const locals = (messages || []).map((m) => ({ ...m, _ts: m._ts ?? m.id }));
    return [...mapped, ...locals].sort((a, b) => (a._ts || 0) - (b._ts || 0));
  }, [liveMessages, messages, currentUserId]);

  // New Interactive states
  const [showPinnedModal, setShowPinnedModal] = useState(false);
  // Interest confirmation state
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showBuyStatusPicker, setShowBuyStatusPicker] = useState(false);
  const [myBuyStatus, setMyBuyStatus] = useState(() => localStorage.getItem(`buytogether_buy_status_${resolvedGroupId}`) || '');
  const [myInterestUnits, setMyInterestUnits] = useState(parseInt(group.myInterest) || 1);
  const [isInterestConfirmed, setIsInterestConfirmed] = useState(() => {
    return localStorage.getItem(`buytogether_confirmed_interest_${resolvedGroupId}`) === 'true' || location.state?.interestConfirmed === true;
  });

  // Group membership derived dynamically via useMemo above.

  const handleJoinGroup = async () => {
    try {
      if (!resolvedGroupId) return;
      const res = await joinGroup(resolvedGroupId);
      if (res?.data) {
        setGroupState(res.data);
        showToast('Successfully joined the group!', '🎉');
      }
    } catch (err) {
      console.error('Failed to join group:', err);
      showToast(err.response?.data?.message || 'Failed to join group', '❌');
    }
  };

  const handleLeaveGroup = async () => {
    try {
      if (!resolvedGroupId) return;
      const res = await leaveGroup(resolvedGroupId);
      if (res?.data) {
        setGroupState(res.data);
        showToast('Successfully left the group.', '🚪');
        navigate('/groups');
      }
    } catch (err) {
      console.error('Failed to leave group:', err);
      showToast(err.response?.data?.message || 'Failed to leave group', '❌');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (currentUserId && String(memberId) === String(currentUserId)) {
      await handleLeaveGroup();
    } else {
      try {
        if (!resolvedGroupId) return;
        await kickGroupMember(resolvedGroupId, memberId);
        setGroupState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            members: (prev.members || []).filter(m => String(m._id || m.id || m) !== String(memberId))
          };
        });
        showToast('Member removed from group', '👋');
      } catch (err) {
        console.error('Failed to remove member:', err);
        showToast(err.response?.data?.message || 'Failed to remove member', '❌');
      }
    }
  };

  const realMembers = useMemo(() => {
    if (!groupState) return [];
    
    const adminId = groupState.admin?._id || groupState.admin?.id || groupState.admin;
    const allUsersMap = new Map();
    
    if (groupState.admin && typeof groupState.admin === 'object') {
      const id = String(groupState.admin._id || groupState.admin.id);
      allUsersMap.set(id, {
        ...groupState.admin,
        isAdmin: true
      });
    }
    
    (groupState.members || []).forEach(m => {
      if (m && typeof m === 'object') {
        const id = String(m._id || m.id);
        allUsersMap.set(id, {
          ...m,
          isAdmin: id === String(adminId)
        });
      }
    });

    return Array.from(allUsersMap.values()).map((user) => {
      const isCurrentUser = currentUserId && String(user._id || user.id) === String(currentUserId);
      const isUserAdmin = user.isAdmin;
      
      let buyStatus = 'Interested';
      if (isCurrentUser) {
        buyStatus = localStorage.getItem(`buytogether_buy_status_${resolvedGroupId}`) || 'Exploring';
      } else if (isUserAdmin) {
        buyStatus = 'Ready to Buy';
      } else {
        const hash = (user.name || '').charCodeAt(0) % 3;
        buyStatus = hash === 0 ? 'Serious' : hash === 1 ? 'Interested' : 'Exploring';
      }

      return {
        id: user._id || user.id,
        name: isCurrentUser ? 'You' : user.name,
        role: isUserAdmin ? 'Admin' : 'Member',
        number: user.phone ? `+91 ${user.phone}` : '+91 99999 99999',
        phone: user.phone || '',
        location: user.location || '',
        avatar: user.avatar || getPlaceholderAvatar(user.name),
        isCurrentUser,
        buyStatus
      };
    });
  }, [groupState, currentUserId, resolvedGroupId]);

  const realConfirmedMembers = useMemo(() => {
    return realMembers
      .filter(m => m.buyStatus !== 'Exploring')
      .map((m) => {
        const isCurrentUser = m.name === 'You';
        const isAdminMember = m.role === 'Admin';
        
        let units = 1;
        if (isCurrentUser) {
          units = myInterestUnits;
        } else {
          units = (m.name.length % 2) + 1; 
        }
        
        let badge = 'Verified Buyer';
        if (isAdminMember) {
          badge = 'Co-Owner';
        } else if (isCurrentUser) {
          badge = 'Active Buyer';
        } else if (units > 1) {
          badge = 'Super Buyer';
        }

        return {
          ...m,
          units,
          badge
        };
      });
  }, [realMembers, myInterestUnits]);

  const [selectedMessageForMenu, setSelectedMessageForMenu] = useState(null);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [profileMember, setProfileMember] = useState(null);

  // File Upload states and refs
  const fileInputRef = useRef(null);
  const [fileTypeToUpload, setFileTypeToUpload] = useState('image'); // 'image' or 'document'

  const triggerFileUpload = (type) => {
    setFileTypeToUpload(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const processFile = async (file, kind = fileTypeToUpload) => {
    if (!file) return;

    setShowAttachmentDrawer(false);

    const tempId = `temp-${Date.now()}`;
    const localUrl = URL.createObjectURL(file);

    if (kind === 'image') {
      const isVideo = file.type.startsWith('video/');
      
      // Optimistic preview message
      const optMsg = {
        id: tempId,
        _ts: Date.now(),
        name: 'You',
        avatar: currentUser?.avatar || getPlaceholderAvatar(currentUser?.name || 'You'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        uploading: true,
        content: ''
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
        content: `Shared a document: ${file.name}`
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

  const handleFileChange = (e) => processFile(e.target.files[0]);

  // Camera: inside the Flutter wrapper capture a photo through the native
  // bridge (the WebView file-chooser camera doesn't work); in a browser this
  // opens the OS camera. Video capture isn't supported here — share clips from
  // Gallery. The captured photo is sent through the normal image flow.
  const handleCameraShare = async () => {
    setShowAttachmentDrawer(false);
    const file = await captureCameraPhoto();
    if (file) processFile(file, 'image');
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
            // Fallback to coordinates
            await sendLiveMessage({
              type: 'location',
              locationData: {
                lat: lat.toFixed(4),
                lng: lng.toFixed(4),
                city: group.location || "Mumbai",
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
                city: `${group.location || "Mumbai"}, India`,
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

  const handleSendMessage = () => {
    const text = messageInput.trim();
    if (!text || !isJoined) return;
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

    // Persist to Firebase RTDB via the backend; it echoes back over the socket.
    sendLiveMessage(text, replyTo).catch(() => {});
    setReplyingToMessage(null);
    setMessageInput('');
    if (activeTab !== 'Chat') setActiveTab('Chat');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const handleCreatePollSubmit = async (question, optionsArr) => {
    try {
      const payload = {
        type: 'poll',
        content: `New Poll: ${question}`,
        quoteData: {
          isPoll: true,
          question: question,
          options: optionsArr.map((opt) => ({
            label: opt,
            votes: 0,
            percentage: 0,
            color: "bg-primary opacity-50",
            selected: false
          })),
          totalVotes: 0,
          votesMap: {}
        }
      };
      await sendLiveMessage(payload);
      setShowPollModal(false);
    } catch (err) {
      console.error('Failed to create poll:', err);
    }
  };

  const handleVote = async (messageId, optionIndex) => {
    try {
      if (!resolvedGroupId || !messageId) return;
      await votePollMessage(resolvedGroupId, messageId, optionIndex);
    } catch (err) {
      console.error('Failed to register vote:', err);
    }
  };

  const handleMessageReaction = async (messageId, emoji) => {
    try {
      if (!resolvedGroupId || !messageId) return;
      await reactLiveMessage(messageId, emoji);
    } catch (err) {
      console.error('Failed to react to message:', err);
    } finally {
      setSelectedMessageForMenu(null);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (!resolvedGroupId || !messageId) return;
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
      // Premium visual toast instead of browser default alert
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
      if (!resolvedGroupId || !messageId) return;
      await reactLiveMessage(messageId, '❤️');
      
      // Premium heart burst pop overlay feedback
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

  const handlePinMessage = async (msg) => {
    try {
      if (!resolvedGroupId || !msg?.id) return;
      await pinMessage(resolvedGroupId, msg.id);
      showToast('Message pinned!', '📌');
    } catch (err) {
      console.error('Failed to pin message:', err);
      showToast(err.response?.data?.message || 'Failed to pin message', '❌');
    } finally {
      setSelectedMessageForMenu(null);
    }
  };

  const handleUnpinMessage = async () => {
    try {
      if (!resolvedGroupId) return;
      await unpinMessage(resolvedGroupId);
      showToast('Message unpinned!', '📌');
    } catch (err) {
      console.error('Failed to unpin message:', err);
      showToast(err.response?.data?.message || 'Failed to unpin message', '❌');
    } finally {
      setShowPinnedModal(false);
    }
  };

  const handleShareGroup = async () => {
    const shareUrl = `${window.location.origin}/groups/${resolvedGroupId}`;
    const shareText = `Hey! Join our co-buying group for ${group.title} on Buy Together! 🤝`;
    // Prefer the native share sheet so users can pick WhatsApp/SMS/etc; fall
    // back to copying the link when the Web Share API isn't available.
    if (navigator.share) {
      try {
        await navigator.share({ title: group.title, text: shareText, url: shareUrl });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // user dismissed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} Link: ${shareUrl}`);
      showToast('Invite link copied to clipboard! 🔗', '🚀');
    } catch {
      showToast('Failed to share.', '❌');
    }
  };

  const handleTogglePin = () => {
    const nextState = !isPinned;
    localStorage.setItem(`buytogether_pinned_group_${resolvedGroupId}`, String(nextState));
    setIsPinned(nextState);
    showToast(nextState ? 'Group pinned to your home screen! 📌' : 'Group unpinned!', '📌');
    setIsMenuOpen(false);
  };

  const handleToggleMute = () => {
    const nextState = !isMuted;
    localStorage.setItem(`buytogether_muted_group_${resolvedGroupId}`, String(nextState));
    setIsMuted(nextState);
    showToast(nextState ? 'Group notifications muted.' : 'Group notifications unmuted.', '🔇');
    setIsMenuOpen(false);
  };

  const handleReportGroup = () => {
    setIsMenuOpen(false);
    setShowReportModal(true);
  };

  const handleReportGroupSubmit = async (reason) => {
    try {
      await createTicket({
        subject: `Report Group: ${group.title}`,
        message: `Reason: ${reason}\nGroup ID: ${resolvedGroupId}`,
        category: 'group'
      });
      showToast('Thank you for reporting. Our moderation team will investigate this group.', '📢');
      setShowReportModal(false);
    } catch (err) {
      console.error('Failed to report group:', err);
      showToast('Failed to submit report. Please try again.', '❌');
    }
  };

  if (loading && !groupState) {
    return <GroupChatSkeleton />;
  }

  if (!groupState) {
    return (
      <div className="flex flex-col h-screen h-[100dvh] w-full max-w-[430px] mx-auto bg-[#F6F6F8] justify-center items-center px-6">
        <div className="text-center">
          <p className="text-sm text-faint font-semibold mb-4">Group not found or has been deleted.</p>
          <button 
            onClick={() => navigate('/groups')} 
            className="px-4 py-2 bg-[#0D9488] text-white text-xs font-black rounded-xl active:scale-95 transition-all shadow-md shadow-[#0D9488]/20"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full max-w-[430px] mx-auto bg-[#F6F6F8] relative overflow-hidden">
      <TopBar 
        navigate={navigate} 
        group={group} 
        onMenuToggle={() => setIsMenuOpen(prev => !prev)} 
        onShare={handleShareGroup}
      />

      {/* Floating 3-Dot Dropdown Options Panel */}
      {isMenuOpen && (
        <div className="absolute top-[56px] right-3.5 w-[180px] bg-surface rounded-2xl border border-line shadow-2xl py-2 z-50 animate-fadeIn">
          <button 
            onClick={handleTogglePin}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{isPinned ? 'Unpin Group' : 'Pin Group'}</span>
          </button>
          <button 
            onClick={handleToggleMute}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            <span>{isMuted ? 'Unmute Group' : 'Mute Group'}</span>
          </button>
          <button 
            onClick={handleReportGroup}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Report Group</span>
          </button>
          <div className="border-t border-line my-1"></div>
          <button 
            onClick={handleLeaveGroup}
            className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Exit Group</span>
          </button>
        </div>
      )}
 
      {/* Main Scrollable Area */}
      <div className={`flex-1 overflow-y-auto ${isInterestConfirmed ? 'pb-24' : 'pb-44'} no-scrollbar relative`}>
        <JoinedInfo group={group} />
        <StatsCard group={group} />
        
        <TabsAndPinned activeTab={activeTab} setActiveTab={setActiveTab} group={group} pinnedMessage={pinnedMessage} onPinClick={() => setShowPinnedModal(true)} />
        
        {/* Dynamic Content Based on Tab */}
        {activeTab === 'Chat' && <ChatFeed messages={displayMessages} loading={chatLoading} typingUsers={typingUsers} onVote={handleVote} onLongPress={setSelectedMessageForMenu} onLike={handleLikeMessage} onReply={setReplyingToMessage} />}
        {activeTab === 'Polls' && <PollsFeed messages={displayMessages} onVote={handleVote} onCreatePoll={() => setShowPollModal(true)} onLongPress={setSelectedMessageForMenu} onLike={handleLikeMessage} onReply={setReplyingToMessage} />}
        {activeTab === 'Members' && (
          <MembersFeed
            groupId={resolvedGroupId}
            isAdmin={isAdmin}
            members={realMembers}
            confirmedMembers={realConfirmedMembers}
            onRemoveMember={handleRemoveMember}
            onViewProfile={setProfileMember}
          />
        )}
        {activeTab === 'Media' && <MediaFeed messages={displayMessages} />}
      </div>
      
      {/* Bottom Action Area */}
      <div className="absolute bottom-0 left-0 w-full bg-[#F6F6F8] z-40">
        {/* Glassmorphic Sharing Option Drawer */}
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
                    action: () => handleCameraShare()
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

          {/* High-Fidelity Emoji Picker Drawer */}
          {showEmojiPicker && (
            <div className="mx-4 mb-2 p-3.5 bg-surface/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl animate-slideUp z-50 flex flex-col gap-2.5">
              {/* Header */}
              <div className="flex justify-between items-center px-1">
                <span className="text-[11px] font-black text-ink uppercase tracking-wider">Emojis</span>
                <button onClick={() => setShowEmojiPicker(false)} className="text-muted hover:text-faint transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category tabs */}
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

              {/* Emojis Grid (7-cols) */}
              <div className="grid grid-cols-7 gap-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar py-1">
                {emojiCategories[activeEmojiCat].list.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      const nextVal = messageInput + emoji;
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

          {/* Chat Input — only on the Chat tab; Polls/Members/Media have no composer */}
          {activeTab === 'Chat' && (
          <div className="px-4 py-2 bg-transparent">
            <div className="flex items-center gap-2">
              {/* Main Input Box */}
              <div className="flex-1 bg-surface rounded-full border border-slate-200/90 shadow-sm px-3.5 py-2.5 flex items-center gap-2.5">
                {/* Smiley/Emoji Button on the Left */}
                <button 
                  onClick={() => { setShowEmojiPicker(prev => !prev); setShowAttachmentDrawer(false); }}
                  className={`active:scale-95 transition-all text-muted hover:text-primary ${showEmojiPicker ? 'text-primary' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Text Field */}
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={messageInput}
                  onChange={(e) => handleNewMessageChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[13px] font-medium text-ink placeholder:text-muted/70 outline-none border-none"
                />

                {/* Attachment Button on the Right of input */}
                <button 
                  onClick={() => { setShowAttachmentDrawer(prev => !prev); setShowEmojiPicker(false); }}
                  className={`active:scale-95 transition-all text-muted hover:text-primary ${showAttachmentDrawer ? 'text-primary' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>

              {/* Send Button ALWAYS visible on the right */}
              <button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0 ${
                  messageInput.trim() 
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
          )}

          {/* Action Panel - shows buy status picker then confirm */}
          {!isInterestConfirmed && (
            <div className="bg-surface rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)] p-4 flex items-center gap-4 pb-8">
              <div className="flex flex-col flex-shrink-0 min-w-[70px]">
                <span className="text-[10px] font-bold text-faint mb-0.5">My Interest</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-extrabold text-ink">{myInterestUnits} {myInterestUnits > 1 ? 'Units' : 'Unit'}</span>
                  <button onClick={() => setShowInterestModal(true)} className="text-[10px] font-bold text-primary active:scale-95 transition-all">Edit</button>
                </div>
              </div>
              
              <button 
                onClick={() => setShowBuyStatusPicker(true)}
                className="flex-1 bg-primary text-white rounded-[16px] py-3.5 flex flex-col items-center justify-center active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <span className="text-[14px] font-bold leading-none mb-1">Confirm Interest</span>
                <span className="text-[9.5px] font-medium opacity-90 leading-none">You will be counted in total quantity</span>
              </button>
            </div>
          )}

          {/* Buy Status Picker Modal */}
          {showBuyStatusPicker && (
            <div className="fixed inset-0 z-[200] flex flex-col justify-end">
              <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setShowBuyStatusPicker(false)} />
              <div className="relative bg-surface rounded-t-[28px] px-5 pt-5 pb-8 shadow-2xl animate-slideUp">
                <div className="w-10 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
                <h2 className="text-[17px] font-black text-ink mb-1">What's your buying intent?</h2>
                <p className="text-[11px] text-muted font-medium mb-5">Let others know where you stand — this shows on your member profile.</p>
                <div className="flex flex-col gap-2.5 mb-6">
                  {[
                    { id: 'Exploring', label: 'Exploring', desc: 'Just looking around, not committed yet', color: 'border-slate-300 bg-slate-50', activeColor: 'border-slate-500 bg-slate-100', dot: 'bg-slate-400', textColor: 'text-slate-600' },
                    { id: 'Interested', label: 'Interested', desc: 'I like this deal and want to know more', color: 'border-blue-200 bg-blue-50/50', activeColor: 'border-blue-500 bg-blue-50', dot: 'bg-blue-500', textColor: 'text-blue-600' },
                    { id: 'Serious', label: 'Serious', desc: 'I plan to buy if the deal goes through', color: 'border-amber-200 bg-amber-50/50', activeColor: 'border-amber-500 bg-amber-50', dot: 'bg-amber-400', textColor: 'text-amber-600' },
                    { id: 'Ready to Buy', label: 'Ready to Buy', desc: 'I am fully committed, ready to purchase!', color: 'border-emerald-200 bg-emerald-50/50', activeColor: 'border-emerald-500 bg-emerald-50', dot: 'bg-emerald-500', textColor: 'text-emerald-600' }
                  ].map(opt => {
                    const isSelected = myBuyStatus === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setMyBuyStatus(opt.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-[0.98] text-left ${
                          isSelected ? opt.activeColor : opt.color
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${opt.dot} ${isSelected ? 'ring-2 ring-offset-1 ring-current' : 'opacity-60'}`} />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className={`text-[13px] font-black ${isSelected ? opt.textColor : 'text-ink'}`}>{opt.label}</span>
                          <span className="text-[10px] text-muted font-medium leading-tight">{opt.desc}</span>
                        </div>
                        {isSelected && (
                          <svg className={`w-4 h-4 flex-shrink-0 ${opt.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={!myBuyStatus}
                  onClick={() => {
                    localStorage.setItem(`buytogether_confirmed_interest_${resolvedGroupId}`, 'true');
                    localStorage.setItem(`buytogether_buy_status_${resolvedGroupId}`, myBuyStatus);
                    setIsInterestConfirmed(true);
                    setShowBuyStatusPicker(false);
                    navigate(`/groups/${resolvedGroupId}/confirm`, { state: { group: { ...group, id: resolvedGroupId } } });
                  }}
                  className="w-full bg-primary text-white rounded-2xl py-3.5 font-black text-[14px] shadow-md shadow-primary/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm & Proceed
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Modals */}
      {showPollModal && <CreatePollModal onClose={() => setShowPollModal(false)} onSubmit={handleCreatePollSubmit} />}
      {showPinnedModal && <PinnedMessageModal group={group} pinnedMessage={pinnedMessage} onUnpin={pinnedMessage ? handleUnpinMessage : null} onClose={() => setShowPinnedModal(false)} />}
      {showInterestModal && (
        <EditInterestModal 
          currentInterest={myInterestUnits} 
          onClose={() => setShowInterestModal(false)} 
          onSave={(val) => {
            setMyInterestUnits(val);
            setShowInterestModal(false);
          }}
        />
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={fileTypeToUpload === 'image' ? 'image/*,video/*' : '.pdf,.doc,.docx,.txt'} 
      />

      {/* Premium Glassmorphic Message Options Drawer */}
      {selectedMessageForMenu && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedMessageForMenu(null)}>
          <div 
            className="w-full max-w-[430px] bg-surface/90 backdrop-blur-md border-t border-line rounded-t-3xl shadow-2xl p-5 animate-slideUp flex flex-col gap-4 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1"></div>
            
            {/* Quick Reactions Bar */}
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

            {/* Actions List */}
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
                onClick={() => handlePinMessage(selectedMessageForMenu)}
                className="w-full px-4 py-3.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-3 transition-colors border-b border-line"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v12l-7-3.5L5 17V5z" />
                </svg>
                <span>Pin Message</span>
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

            {/* Cancel Button */}
            <button
              onClick={() => setSelectedMessageForMenu(null)}
              className="w-full py-3.5 bg-surface border border-line rounded-2xl font-black text-xs text-ink active:scale-95 transition-all text-center shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Member Contact Profile Sheet (WhatsApp-style) */}
      <ContactProfile
        open={!!profileMember}
        onClose={() => setProfileMember(null)}
        profile={profileMember}
        onMessage={
          profileMember && !profileMember.isCurrentUser
            ? () => {
                const m = profileMember;
                setProfileMember(null);
                navigate(`/messages/${m.id}`, {
                  state: { user: { id: m.id, name: m.name, avatar: m.avatar, phone: m.phone, location: m.location } },
                });
              }
            : undefined
        }
      />

      {showReportModal && (
        <ReportModal
          title="Report Group"
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportGroupSubmit}
        />
      )}
    </div>
  );
};

export default GroupChat;
