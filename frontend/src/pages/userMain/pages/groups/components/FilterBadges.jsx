import React from 'react';

const FilterBadges = ({ selectedFilter, onChange }) => {
  const BADGES = [
    {
      id: 'all-groups',
      label: 'All Groups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <rect x="4" y="4" width="6" height="6" rx="1.2" />
          <rect x="14" y="4" width="6" height="6" rx="1.2" />
          <rect x="4" y="14" width="6" height="6" rx="1.2" />
          <rect x="14" y="14" width="6" height="6" rx="1.2" />
        </svg>
      )
    },
    {
      id: 'new',
      label: 'New',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'closing-soon',
      label: 'Closing Soon',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'nearby',
      label: 'Nearby',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar select-none">
      {BADGES.map((badge) => {
        const isActive = selectedFilter === badge.id;
        return (
          <button
            key={badge.id}
            onClick={() => onChange(badge.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 duration-200 border ${
              isActive
                ? 'bg-[#E6F4F2] text-[#0D9488] border-[#0D9488]/15 shadow-sm shadow-[#0D9488]/5 font-bold'
                : 'bg-white text-[#64748B] hover:text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1]'
            }`}
          >
            <span className={isActive ? 'text-[#0D9488]' : 'text-[#94A3B8]'}>
              {badge.icon}
            </span>
            <span>{badge.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBadges;
