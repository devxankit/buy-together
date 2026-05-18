import React from 'react';

/**
 * Premium square-based Category Carousel switcher.
 * Displays "Browse by Categories" and custom flat rounded-xl columns list.
 * Styled strictly with our project's teal signature branding color theme.
 */
const MyCategoriesCarousel = ({ selectedCategory, onChange, onViewAll }) => {
  const CATEGORIES = [
    {
      id: 'all',
      label: 'All',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      )
    },
    {
      id: 'cars-bikes',
      label: 'Cars & Bikes',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 1 14v2c0 .6.4 1 1 1h2" strokeLinecap="round" strokeLinejoin="round"></path>
          <circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round"></circle>
          <circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round"></circle>
          <path d="M9 17h6" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'smartphones',
      label: 'Mobiles',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <rect x="5" y="2" width="14" height="20" rx="3" ry="3"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" strokeWidth="3"></line>
        </svg>
      )
    },
    {
      id: 'electronics',
      label: 'Electronics',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'travel',
      label: 'Travel',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'home-living',
      label: 'Home',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      id: 'more',
      label: 'More',
      icon: (color) => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.25">
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="19" cy="12" r="1.5"></circle>
          <circle cx="5" cy="12" r="1.5"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Header Row */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-[13px] font-black text-[#1E293B] tracking-tight">
          Browse by Categories
        </h2>
        <button 
          onClick={onViewAll}
          className="text-[11px] font-extrabold text-[#0D9488] active:scale-95 transition-all"
        >
          See all
        </button>
      </div>

      {/* Horizontal grid/carousel row */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const strokeColor = isActive ? '#0D9488' : '#64748B';
          
          return (
            <div
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {/* Box container */}
              <div
                className={`w-[56px] h-[56px] rounded-[18px] flex items-center justify-center transition-all duration-300 active:scale-[0.93] ${
                  isActive
                    ? 'bg-gradient-to-tr from-[rgba(11,122,112,0.06)] to-[rgba(13,148,136,0.06)] border-2 border-[#0D9488] shadow-sm'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:border-slate-300'
                }`}
              >
                {cat.icon(strokeColor)}
              </div>

              {/* Label underneath */}
              <span
                className={`text-[9px] font-black tracking-tight leading-none text-center transition-colors ${
                  isActive ? 'text-[#0D9488]' : 'text-[#64748B]'
                }`}
              >
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCategoriesCarousel;
