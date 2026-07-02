import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';

// Resolve a member's display avatar — falls back to a generated initial-avatar
// when the account has no photo.
const memberAvatar = (m) =>
  m?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m?.name || 'User')}&background=random&color=fff`;

const PINNED_KEY = 'buytogether_pinned_groups';
const readPinned = () => { try { return JSON.parse(localStorage.getItem(PINNED_KEY)) || []; } catch { return []; } };

const AllGroupsList = ({ groups, onSortChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const currentUser = useSelector((state) => state.auth.user);
  const userId = currentUser?.id || currentUser?._id || 'guest';

  const userPinnedKey = `buytogether_${userId}_pinned_groups`;

  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(userPinnedKey)) || [];
    } catch {
      return [];
    }
  });

  const togglePin = useCallback((groupId, e) => {
    e.stopPropagation();
    setPinnedIds(prev => {
      const next = prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId];
      localStorage.setItem(userPinnedKey, JSON.stringify(next));
      return next;
    });
  }, [userPinnedKey]);

  // Sort: pinned groups float to the top
  const sortedGroups = [...groups].sort((a, b) => {
    const aPin = pinnedIds.includes(a.id || a._id) ? 1 : 0;
    const bPin = pinnedIds.includes(b.id || b._id) ? 1 : 0;
    return bPin - aPin;
  });

  return (
    <div className="flex flex-col gap-3 select-none pb-4">
      {/* Header section */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="text-[15px] font-extrabold text-ink">
          All Groups
        </h2>
      </div>

      {/* Vertical Groups List */}
      <div className="flex flex-col gap-3.5">
        {sortedGroups.map((group) => {
          const percentage = (group.spotsJoined / group.spotsTotal) * 100;
          const isClosingSoon = group.status === 'closing';
          const isWishlisted = wishlistItems.some(item => String(item.id || item._id) === String(group.id || group._id));
          const groupId = group.id || group._id;
          const lastSeen = Number(localStorage.getItem(`buytogether_group_last_seen_${groupId}`) || 0);
          const groupTime = new Date(group.updatedAt || group.createdAt).getTime();
          const hasUnread = groupTime > lastSeen;
          const isPinned = pinnedIds.includes(groupId);

          return (
            <div
              key={groupId}
              onClick={() => navigate(`/groups/${groupId}/chat`, { state: { group, isJoined: true, isAdmin: group.isAdmin } })}
              className={`bg-surface border ${hasUnread ? 'border-primary/45 shadow-md shadow-primary/5' : 'border-line/70'} hover:border-primary/15 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.99] cursor-pointer relative`}
            >
              {/* Pinned indicator */}
              {isPinned && (
                <div className="absolute top-2 left-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
              )}

              {/* Product Image on the left */}
              <div className="w-[84px] h-[84px] bg-surface-alt border border-line/40 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 self-center">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-contain "
                  loading="lazy"
                />
              </div>

              {/* Middle Section: Group details & Avatars */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  {/* Title & Status Badge row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-ink truncate max-w-[125px]">
                      {group.title}
                    </h3>
                    {isClosingSoon ? (
                      <span className="bg-[#FEF3C7] text-[#D97706] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight">
                        Closing Soon
                      </span>
                    ) : (
                      <span className="bg-[#DCFCE7] text-[#15803D] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight">
                        Active
                      </span>
                    )}
                    {hasUnread && (
                      <span className="bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight animate-pulse shadow-sm shadow-primary/20">
                        New
                      </span>
                    )}
                  </div>

                  {/* Location & Category string */}
                  <p className="text-[9.5px] font-extrabold text-muted mt-0.5">
                    {group.category} • {group.location}
                  </p>

                  {/* Slogan */}
                  <p className="text-[10px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-1">
                    {group.slogan}
                  </p>
                </div>

                {/* Avatar stack and Progress bar stack */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {/* Real member avatars (up to 3) with a real overflow count */}
                  {(() => {
                    const shown = (group.members || []).slice(0, 3);
                    const extra = Math.max((group.spotsJoined || 0) - shown.length, 0);
                    if (shown.length === 0) return null;
                    return (
                      <div className="flex items-center flex-shrink-0">
                        {shown.map((m, idx) => (
                          <img
                            key={m.id || m._id || idx}
                            src={memberAvatar(m)}
                            alt={m.name || 'Member'}
                            className="w-5 h-5 rounded-full border border-surface object-cover -mr-1.5 bg-surface-alt"
                            style={{ zIndex: 3 - idx }}
                            loading="lazy"
                          />
                        ))}
                        {extra > 0 && (
                          <div className="w-5 h-5 rounded-full bg-[#E2E8F0] border border-surface text-[8px] font-black text-[#475569] flex items-center justify-center -mr-1.5 z-[0]">
                            +{extra}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Progress Line */}
                  <div className="flex-1 min-w-[70px] h-[5px] bg-[#F1F5F9] rounded-full overflow-hidden self-center">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: pin, wishlist, spots indicator & time */}
              <div className="flex flex-col items-end justify-between flex-shrink-0 pl-1">
                <div className="flex items-center gap-1">
                  {/* Pin Button */}
                  <button
                    onClick={(e) => togglePin(groupId, e)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${isPinned ? 'bg-primary/10' : 'bg-surface-alt hover:bg-surface-alt/80'}`}
                    title={isPinned ? 'Unpin group' : 'Pin group'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 ${isPinned ? 'text-primary' : 'text-muted'}`} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </button>
                  {/* Wishlist Button */}
                  <WishlistButton
                    isWishlisted={isWishlisted}
                    onClick={() => dispatch(toggleWishlist(group))}
                  />
                </div>

                {/* Spots Progress Stack Box */}
                <div className="bg-surface-alt border border-line/50 px-2 py-1.5 rounded-xl text-center min-w-[60px]">
                  <p className="text-[10px] font-black text-ink leading-none">
                    {group.spotsJoined}/{group.spotsTotal}
                  </p>
                  <p className="text-[8.5px] font-bold text-muted mt-0.5 leading-none">
                    Buyers
                  </p>
                </div>

                {/* Clock indicator & Time left */}
                <div
                  className={`flex items-center gap-0.5 text-[9.5px] font-bold ${
                    isClosingSoon ? 'text-[#EF4444]' : 'text-muted'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-2.5 h-2.5 ${isClosingSoon ? 'text-[#EF4444]' : 'text-muted'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{group.daysLeft}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllGroupsList;
