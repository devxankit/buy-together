import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroup, joinGroup, leaveGroup } from '../../../../services/group.api';
import { toggleWishlist } from '../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../components/ui/WishlistButton';
import { showToast } from '../../../../utils/toast';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user) || {};
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const { data } = await getGroup(groupId);
      setGroup(data);
    } catch (err) {
      console.error('Failed to load group details:', err);
      showToast('Failed to load group details.', '❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);

  const handleJoin = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const { data } = await joinGroup(groupId);
      setGroup(data);
      showToast('Successfully joined the group! 🎉');
    } catch (err) {
      console.error('Failed to join group:', err);
      showToast(err.response?.data?.message || 'Failed to join group.', '❌');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans gap-3">
        <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted">Loading details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans p-6 text-center gap-4">
        <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-ink">Group Not Found</h2>
        <p className="text-sm text-muted">This group pool might have been deleted or expired.</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-all shadow-md">
          Go Back
        </button>
      </div>
    );
  }

  const isMember = group.members?.some(m => String(m._id || m.id || m) === String(currentUser.id || currentUser._id));
  const spotsTotal = group.spotsTotal || 1000;
  const spotsJoined = group.spotsJoined || 0;
  const spotsNeeded = Math.max(0, spotsTotal - spotsJoined);
  const percentage = Math.round((spotsJoined / spotsTotal) * 100) || 0;
  const isWishlisted = wishlistItems.some(item => String(item.id || item._id) === String(group.id || group._id));

  const renderAvatars = () => {
    const list = group.members || [];
    const displayList = list.slice(0, 3);
    const remainingCount = Math.max(0, spotsJoined - displayList.length);

    return (
      <div className="flex items-center">
        {displayList.map((m, idx) => {
          const avatarUrl = m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=random&color=fff`;
          return (
            <img
              key={idx}
              src={avatarUrl}
              alt={m.name || 'Member'}
              className="w-7 h-7 rounded-full border-2 border-surface object-cover -mr-1.5"
              style={{ zIndex: 10 - idx }}
            />
          );
        })}
        {remainingCount > 0 && (
          <div className="w-7 h-7 rounded-full bg-[#E2E8F0] dark:bg-slate-800 border-2 border-surface text-[8.5px] font-black text-[#475569] dark:text-[#94A3B8] flex items-center justify-center -mr-1.5 z-0">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[var(--surface-deep)] font-sans pb-24 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 bg-surface border-b border-line sticky top-0 z-20">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex-shrink-0 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all">
            <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <img 
            src={group.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&q=80'} 
            alt={group.title} 
            className="w-9 h-9 rounded-lg object-cover border border-line flex-shrink-0"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-[13px] font-black text-ink truncate max-w-[175px] leading-none">{group.title}</h2>
              <span className={`text-[6.5px] font-black px-1.5 py-0.5 rounded-[4px] leading-none uppercase tracking-wide ${
                group.status === 'closing' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#DCFCE7] text-[#15803D]'
              }`}>
                {group.status === 'closing' ? 'Closing Soon' : 'Active'}
              </span>
            </div>
            <p className="text-[9.5px] font-bold text-muted truncate mt-0.5 leading-none">
              {group.category || 'General'} • {group.location || 'India'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Link copied to clipboard! 🔗');
            }} 
            className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all text-ink"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.57 2.286M15.316 11.258l-4.57-2.286M21 12a3 3 0 11-6 0 3 3 0 016 0zm-9-6a3 3 0 11-6 0 3 3 0 016 0zm-9 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={() => showToast('Options coming soon!', 'ℹ️')} 
            className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center active:scale-90 transition-all text-ink"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Avatars summary row */}
        <div className="flex items-center gap-2 px-1">
          {renderAvatars()}
          <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]">
            <span className="text-ink font-extrabold">{spotsJoined} / {spotsTotal}</span> buyers joined
          </span>
        </div>

        {/* Co-Buying Stats Card */}
        <div className="bg-surface border border-line rounded-[20px] p-4.5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-[12px] font-black text-ink leading-snug">
                Let's reach {spotsTotal} buyers and get the best deal!
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[9px] font-bold text-muted leading-tight">Deal closes in</p>
              <p className="text-[10px] font-black text-[#0D9488] uppercase mt-0.5 tracking-tight">
                {spotsNeeded > 0 ? `${spotsNeeded} MORE NEEDED` : 'GOAL REACHED!'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 h-[7px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/10">
              <div 
                className="h-full bg-gradient-to-r from-[#0B7A70] to-[#0D9488] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[10.5px] font-black text-[#0D9488] ml-3">{percentage}%</span>
          </div>

          <div className="border-t border-line/60 my-0.5" />

          <div className="grid grid-cols-2 gap-1 text-center">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-[11.5px] font-black text-ink leading-tight">{spotsJoined}</p>
              <p className="text-[8.5px] font-bold text-muted mt-0.5 leading-none">Buyers</p>
            </div>
            
            <div className="border-l border-line/60">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-[11.5px] font-black text-ink leading-tight">{spotsJoined}</p>
              <p className="text-[8.5px] font-bold text-muted mt-0.5 leading-none">Units</p>
            </div>
          </div>
        </div>

        {/* Join Group to View Chat Callout Card */}
        <div className="bg-surface border border-line rounded-[24px] py-9 px-6 shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-primary-soft text-primary rounded-full flex items-center justify-center flex-shrink-0">
            {isMember ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )}
          </div>

          <h3 className="text-[16px] font-black text-ink">
            {isMember ? 'You\'re in the Group!' : 'Join Group to View Chat'}
          </h3>

          <p className="text-[11.5px] font-semibold text-muted leading-relaxed max-w-[280px]">
            {isMember 
              ? 'You can now coordinate deal payments, vote on options, and chat with other members.'
              : `Join ${spotsJoined} others and get access to exclusive group chat, polls, and discussions.`
            }
          </p>

          {!isMember ? (
            <button 
              onClick={handleJoin}
              disabled={actionLoading}
              className="bg-[#0D9488] hover:bg-[#0B7A70] text-white font-extrabold text-[12.5px] px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              <span>+</span> {actionLoading ? 'Joining...' : 'Join Group Now'}
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: true } })}
              className="bg-[#0D9488] hover:bg-[#0B7A70] text-white font-extrabold text-[12.5px] px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95"
            >
              Enter Group Chat 💬
            </button>
          )}
        </div>
      </div>

      {/* Bottom Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface/85 backdrop-blur-md border-t border-line px-5 py-4 flex z-30 shadow-lg">
        {!isMember ? (
          <button 
            onClick={handleJoin}
            disabled={actionLoading}
            className="w-full py-3.5 bg-[#0D9488] hover:bg-[#0B7A70] text-white rounded-2xl font-black text-[13.5px] text-center active:scale-95 transition-all shadow-md shadow-[#0D9488]/20"
          >
            {actionLoading ? 'Joining...' : 'Join Group To Interact'}
          </button>
        ) : (
          <button 
            onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: true } })}
            className="w-full py-3.5 bg-[#0D9488] hover:bg-[#0B7A70] text-white rounded-2xl font-black text-[13.5px] text-center active:scale-95 transition-all shadow-md shadow-[#0D9488]/20"
          >
            Open Group Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
