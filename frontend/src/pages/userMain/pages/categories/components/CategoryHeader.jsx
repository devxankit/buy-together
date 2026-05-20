import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Premium CategoryHeader matching the mockup's integrated top search and actions.
 * Renders in a clean white style matching the layout with location toggle and notification bell.
 * Subtitle description has been removed as requested.
 */
const CategoryHeader = ({ 
  title = "Groups", 
  currentLocation = "Indore", 
  onLocationClick, 
  onSearchChange,
  searchValue,
  onFilterClick
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-1 select-none bg-white">
      {/* Row 1: Header Titles and Right Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-[26px] font-black text-[#1E293B] tracking-tight leading-none">
            {title}
          </h1>
        </div>

        {/* Location chip ONLY */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          {/* Location button inside white rounded border with map pin */}
          <button 
            onClick={() => navigate('/location')}
            className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1.5 rounded-full hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-black text-[#1E293B]">{currentLocation}</span>
            <svg className="w-2.5 h-2.5 text-[#64748B] ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Search input & filter icon */}
      <div className="flex gap-2.5 w-full mt-1.5">
        <div className="relative flex-1 flex items-center">
          <svg className="w-4 h-4 absolute left-3.5 text-[#94A3B8] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search groups, deals or anything..."
            className="w-full h-[44px] bg-[#F8FAFC] text-[11px] font-semibold text-[#1E293B] placeholder:text-[#94A3B8]/80 rounded-[14px] pl-10 pr-3 border border-[#E2E8F0]/80 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all"
          />
        </div>
        <button onClick={onFilterClick} className="w-[44px] h-[44px] bg-[#F8FAFC] border border-[#E2E8F0]/80 text-[#64748B] hover:text-[#1E293B] rounded-[14px] flex items-center justify-center active:scale-95 transition-all flex-shrink-0 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;
