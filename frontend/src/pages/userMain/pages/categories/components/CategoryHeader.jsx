import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Premium CategoryHeader matching the mockup's integrated top search and actions.
 * Renders in a clean white style matching the layout with Create Group button and notification bell.
 * Location selection moved to the filter panel.
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
    <div className="flex flex-col gap-4 px-4 pt-5 pb-1 select-none bg-surface">
      {/* Row 1: Header Titles and Right Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-[26px] font-black text-ink tracking-tight leading-none">
            {title}
          </h1>
        </div>

        {/* Create Group Button — matches My Groups header style */}
        <button
          onClick={() => navigate('/groups/create')}
          className="flex items-center gap-1.5 bg-primary px-3 py-2 rounded-xl shadow-md shadow-primary/25 active:scale-95 transition-all flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-[11px] font-black text-white whitespace-nowrap">Create Group</span>
        </button>
      </div>

      {/* Row 2: Search input & filter icon */}
      <div className="flex gap-2.5 w-full mt-1.5">
        <div className="relative flex-1 flex items-center">
          <svg className="w-4 h-4 absolute left-3.5 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search groups, deals or anything..."
            className="w-full h-[44px] bg-surface-alt text-[11px] font-semibold text-ink placeholder:text-muted/80 rounded-[14px] pl-10 pr-3 border border-line/80 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-primary transition-all"
          />
        </div>
        <button onClick={onFilterClick} className="w-[44px] h-[44px] bg-surface-alt border border-line/80 text-[#64748B] hover:text-ink rounded-[14px] flex items-center justify-center active:scale-95 transition-all flex-shrink-0 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryHeader;

