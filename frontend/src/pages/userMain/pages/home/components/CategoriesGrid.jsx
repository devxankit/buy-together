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

      {/* Grid/Flex of categories in exactly 2 rows, horizontally scrollable */}
      <div className="flex overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 select-none">
        <div className="grid grid-rows-2 grid-flow-col gap-x-5 gap-y-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="flex flex-col items-center cursor-pointer group select-none w-[70px] flex-shrink-0"
            >
              {/* Independent Circular Image */}
              <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center group-active:scale-95 transition-all overflow-hidden bg-surface-alt flex-shrink-0">
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary scale-125">
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
    </div>
  );
};

export default CategoriesGrid;
