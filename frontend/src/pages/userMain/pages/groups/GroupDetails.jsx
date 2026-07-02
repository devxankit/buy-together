import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGroup, joinGroup, leaveGroup } from '../../../../services/group.api';
import { swr, swrPeek } from '../../../../services/swr';
import { toggleWishlist } from '../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../components/ui/WishlistButton';
import { createTicket } from '../../../../services/ticket.api';
import { showToast } from '../../../../utils/toast';

const GroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user) || {};
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const detailKey = `group:detail:${groupId}`;
  const [group, setGroup] = useState(() => swrPeek(detailKey) || null);
  const [loading, setLoading] = useState(() => swrPeek(detailKey) === undefined);
  const [actionLoading, setActionLoading] = useState(false);

  // Options Menu & Modal States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const userId = currentUser.id || currentUser._id || 'guest';
  const userPinnedKey = `buytogether_${userId}_pinned_groups`;

  useEffect(() => {
    if (groupId) {
      try {
        const pinned = JSON.parse(localStorage.getItem(userPinnedKey)) || [];
        setIsPinned(pinned.includes(groupId));
      } catch (e) {
        setIsPinned(false);
      }
    }
  }, [groupId, userPinnedKey]);

  const handleTogglePin = () => {
    const nextState = !isPinned;
    try {
      const pinned = JSON.parse(localStorage.getItem(userPinnedKey)) || [];
      const updated = nextState 
        ? [...new Set([...pinned, groupId])]
        : pinned.filter(id => id !== groupId);
      localStorage.setItem(userPinnedKey, JSON.stringify(updated));
    } catch (e) {
      localStorage.setItem(userPinnedKey, JSON.stringify(nextState ? [groupId] : []));
    }
    setIsPinned(nextState);
    showToast(nextState ? 'Group pinned to your home screen! 📌' : 'Group unpinned!', '📌');
    setIsMenuOpen(false);
  };

  const handleShareGroup = async () => {
    const shareUrl = `${window.location.origin}/groups/${groupId}`;
    const shareText = `Hey! Join our co-buying group for ${group?.title} on Buy Together! 🤝`;
    if (navigator.share) {
      try {
        await navigator.share({ title: group?.title, text: shareText, url: shareUrl });
        setIsMenuOpen(false);
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} Link: ${shareUrl}`);
      showToast('Invite link copied to clipboard! 🔗', '🚀');
    } catch {
      showToast('Failed to share.', '❌');
    }
    setIsMenuOpen(false);
  };

  const handleReportGroupSubmit = async (reason) => {
    try {
      await createTicket({
        subject: `Report Group: ${group?.title}`,
        message: `Reason: ${reason}\nGroup ID: ${groupId}`,
        category: 'group'
      });
      showToast('Thank you for reporting. Our moderation team will investigate this group.', '📢');
      setShowReportModal(false);
    } catch (err) {
      console.error('Failed to report group:', err);
      showToast('Failed to submit report. Please try again.', '❌');
    }
  };

  useEffect(() => {
    let active = true;
    // Re-seed for the current id (the component stays mounted when only the
    // route param changes), so switching between groups paints instantly.
    const key = `group:detail:${groupId}`;
    const seeded = swrPeek(key);
    if (seeded) { setGroup(seeded); setLoading(false); } else { setLoading(true); }

    swr(
      key,
      async () => {
        const { data } = await getGroup(groupId);
        return data;
      },
      { ttl: 0, onData: (d) => { if (active) { setGroup(d); setLoading(false); } } }
    ).catch((err) => {
      console.error('Failed to load group details:', err);
      showToast('Failed to load group details.', '❌');
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [groupId]);

  const handleJoin = async () => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      const { data } = await joinGroup(groupId);
      setGroup(data);
      showToast('Successfully joined the group! 🎉');
      // Redirect directly to group chat after joining
      navigate(`/groups/${groupId}/chat`, { state: { group: data, isJoined: true }, replace: true });
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
  // Capacity reached — uses the real cap (not the 1000 display fallback). A
  // `spotsTotal` of 0 means uncapped, so the group is never "full".
  const isFull = group.spotsTotal > 0 && spotsJoined >= group.spotsTotal;
  const isClosed = group.status === 'completed' || group.status === 'locked' || (group.closesAt && new Date(group.closesAt) < new Date());
  const isWishlisted = wishlistItems.some(item => item.id === group.id);

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
                isClosed
                  ? 'bg-red-100 text-red-600'
                  : group.status === 'closing'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#DCFCE7] text-[#15803D]'
              }`}>
                {isClosed ? 'Closed' : group.status === 'closing' ? 'Closing Soon' : 'Active'}
              </span>
            </div>
            <p className="text-[9.5px] font-bold text-muted truncate mt-0.5 leading-none">
              {group.category || 'General'} • {group.location || 'India'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 relative">
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all text-ink ${isMenuOpen ? 'bg-primary/10' : 'bg-surface-alt'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute top-[40px] right-0 w-[180px] bg-surface rounded-2xl border border-line shadow-2xl py-2 z-50 animate-fadeIn">
              {/* Share */}
              <button
                onClick={handleShareGroup}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.57 2.286M15.316 11.258l-4.57-2.286M21 12a3 3 0 11-6 0 3 3 0 016 0zm-9-6a3 3 0 11-6 0 3 3 0 016 0zm-9 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Share Group Link</span>
              </button>

              {/* Pin / Unpin */}
              <button
                onClick={handleTogglePin}
                className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-faint" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span>{isPinned ? 'Unpin Group' : 'Pin Group'}</span>
              </button>

              {/* Report (Only if the user is not the admin creator) */}
              {group?.admin && String(group.admin._id || group.admin.id || group.admin) !== String(userId) && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowReportModal(true);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-ink hover:bg-surface-alt flex items-center gap-2.5 transition-colors border-t border-line mt-1 pt-3.5"
                >
                  <svg className="w-4 h-4 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Report Group</span>
                </button>
              )}
            </div>
          )}
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
          {/* Primary join / enter-chat action lives in the fixed bottom bar below
              to avoid a duplicate button on the same screen. */}
        </div>
      </div>

      {/* Bottom Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface/85 backdrop-blur-md border-t border-line px-5 py-4 flex z-30 shadow-lg">
        {isClosed ? (
          <button
            disabled
            className="w-full py-3.5 bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-[13.5px] text-center cursor-not-allowed opacity-75"
          >
            Deal Closed
          </button>
        ) : !isMember ? (
          <button
            onClick={handleJoin}
            disabled={actionLoading || isFull}
            className={`w-full py-3.5 text-white rounded-2xl font-black text-[13.5px] text-center transition-all shadow-md shadow-[#0D9488]/20 ${isFull ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed opacity-80' : 'bg-[#0D9488] hover:bg-[#0B7A70] active:scale-95'}`}
          >
            {isFull ? 'Group Full' : actionLoading ? 'Joining...' : 'Join Group'}
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

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface rounded-3xl w-full max-w-[340px] p-5 shadow-2xl border border-line" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[16px] font-black text-ink mb-2">Report Group</h2>
            <p className="text-[11px] text-muted font-bold mb-4">Please describe the reason for reporting this. Our moderation team will review it.</p>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const reason = e.target.reason.value;
                if (!reason.trim()) return;
                await handleReportGroupSubmit(reason.trim());
              }} 
              className="flex flex-col gap-4"
            >
              <textarea
                name="reason"
                placeholder="Type your reason here..."
                rows={3}
                required
                className="w-full p-3 text-[12px] font-medium text-ink placeholder:text-muted/60 bg-surface-alt border border-slate-200/90 rounded-2xl outline-none focus:border-primary transition-all resize-none"
                maxLength={1000}
              />
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-faint bg-surface-alt border border-line active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
