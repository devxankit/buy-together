import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JoinedGroupsList = ({ groups }) => {
  const navigate = useNavigate();
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
    <div className="flex flex-col gap-4 select-none pb-8 animate-fadeIn">
      {sortedGroups.map((group) => {
        const percentage = Math.round((group.spotsJoined / group.spotsTotal) * 100);
        const isClosingSoon = group.status === 'closing';
        const groupId = group.id || group._id;
        const lastSeen = Number(localStorage.getItem(`buytogether_group_last_seen_${groupId}`) || 0);
        const groupTime = new Date(group.updatedAt || group.createdAt).getTime();
        const hasUnread = groupTime > lastSeen;
        const isPinned = pinnedIds.includes(groupId);

        return (
          <div
            key={groupId}
            onClick={() => navigate(`/groups/${groupId}/chat`, { state: { group, isJoined: true } })}
            className={`bg-surface border ${hasUnread ? 'border-primary/45 shadow-md shadow-primary/5' : 'border-line/70'} hover:border-primary/15 rounded-[22px] p-3.5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative`}
          >
            {/* ── TOP SECTION (Product Image and Info) ── */}
            <div className="flex gap-3">
              {/* Product Image left */}
              <div className="w-[84px] h-[84px] bg-surface-alt border border-line/40 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 self-center relative">
                {/* Floating Closing Label top of image */}
                {group.closingLabel && (
                  <div className="absolute top-1 left-1 bg-[#FEF3C7] text-[#D97706] text-[7.5px] font-black px-1.5 py-0.5 rounded-[5px] leading-none uppercase tracking-wide">
                    {group.closingLabel}
                  </div>
                )}
                
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-contain "
                  loading="lazy"
                />

                {/* Floating Member Count bottom of image */}
                <div className="absolute bottom-1 right-1 bg-primary px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5 text-[8px] font-bold text-white shadow-sm shadow-[#0D9488]/10 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2 h-2 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{group.spotsJoined}</span>
                </div>
              </div>

              {/* Product details center */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
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

                  <p className="text-[9px] font-extrabold text-muted mt-0.5">
                    {group.category} • {group.location}
                  </p>

                  <p className="text-[9.5px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-1">
                    {group.slogan}
                  </p>
                </div>

                {/* Progress bar line with percentage */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-[5px] bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[9.5px] font-bold text-primary">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Right column indicators */}
              <div className="flex flex-col items-end justify-between flex-shrink-0 pl-1 self-stretch">
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

                {/* Spots progress stack */}
                <div className="bg-surface-alt border border-line/50 px-2 py-1 rounded-xl text-center min-w-[56px]">
                  <p className="text-[9.5px] font-black text-ink leading-none">
                    {group.spotsJoined}/{group.spotsTotal}
                  </p>
                  <p className="text-[8px] font-bold text-muted mt-0.5 leading-none">
                    Buyers
                  </p>
                </div>

                {/* Time left */}
                <div
                  className={`flex items-center gap-0.5 text-[9px] font-bold ${
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

            {/* ── DIVIDING LINE ── */}
            <div className="border-t border-[#F1F5F9]" />

            {/* ── BOTTOM SECTION (real metrics + CTA) ── */}
            <div className="flex items-center justify-between gap-2.5 pt-0.5">
              {/* Real metrics only — derived from backend group data */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                {/* Column 1: Spots Left */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Spots Left</span>
                  </div>
                  <p className="text-[10px] font-black text-[#475569] leading-tight">
                    {Math.max(group.spotsTotal - group.spotsJoined, 0)} of {group.spotsTotal}
                  </p>
                </div>

                {/* Column 2: Category */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 5a2 2 0 012-2h4.586a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-4.586 4.586a1 1 0 01-1.414 0l-7-7A1 1 0 013 9.586V5z" />
                    </svg>
                    <span>Category</span>
                  </div>
                  <p className="text-[10px] font-black text-[#475569] leading-tight truncate">
                    {group.category}
                  </p>
                </div>
              </div>

              {/* View Group Button CTA */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: true } });
                }}
                className="bg-surface hover:bg-primary/5 text-primary border border-primary/25 hover:border-primary/40 px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all duration-200 active:scale-95 flex-shrink-0 self-center"
              >
                View Group
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JoinedGroupsList;
