import React from 'react';

const SearchAndFilter = ({ searchValue, onSearchChange, onFilterClick }) => {
  return (
    <div className="flex gap-2.5 w-full select-none">
      {/* Search Input Container */}
      <div className="relative flex-1 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 absolute left-4 text-muted pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search groups by product, brand or category..."
          className="w-full h-11 bg-surface-alt text-xs font-semibold text-ink placeholder:text-muted/95 rounded-2xl pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 transition-all border border-line/80 focus:border-primary"
        />
      </div>

      {/* Filter Icon Button */}
      <button
        onClick={onFilterClick}
        className="w-11 h-11 bg-surface-alt hover:bg-[#F1F5F9] text-[#64748B] hover:text-primary rounded-2xl flex items-center justify-center border border-line/80 active:scale-95 transition-all flex-shrink-0 duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchAndFilter;
