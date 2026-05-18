import React from 'react';

/**
 * Pixel-perfect replica of the Popular Categories section in the mockup.
 * Displays 6 categories side-by-side in a single row with:
 * 1. A clean, white, rounded-2xl icon container card.
 * 2. Elegant, thin teal outline icons.
 * 3. Text labels located outside and beneath the card border.
 */
const CategoriesGrid = ({ categories, onCategoryClick, onViewAll }) => {
  return (
    <div className="flex flex-col gap-3.5">
      {/* Categories Header Row */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">Popular Categories</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-primary flex items-center gap-0.5 active:scale-95 transition-all"
        >
          See All
          <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grid of exactly 8 categories in a clean 2x4 grid */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-3.5 px-0.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className="flex flex-col items-center cursor-pointer group select-none"
          >
            {/* Top Icon Card (Solid white, rounded-2xl, subtle border) */}
            <div className="w-[56px] h-[56px] bg-white border border-line/65 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-primary/40 group-active:scale-90 transition-all overflow-hidden">
              {cat.coverImage ? (
                <img
                  src={cat.coverImage}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary">
                  {cat.icon}
                </span>
              )}
            </div>
            
            {/* Text Label Below (Outside the card) */}
            <span className="text-[10px] font-bold text-ink mt-1.5 text-center tracking-tight leading-none truncate w-full">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
