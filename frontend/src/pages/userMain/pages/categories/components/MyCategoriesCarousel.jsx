import React from 'react';

/**
 * Premium Category Carousel switcher.
 * Renders categories with rich cover images inside rounded-2xl container boxes,
 * perfectly matching the homepage categories visual style.
 * Highlighted with signature teal border rings when active.
 */
const MyCategoriesCarousel = ({ categories = [], selectedCategory, onChange, onViewAll }) => {
  const list = [
    {
      id: 'all',
      label: 'All',
      coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=120&q=80'
    },
    ...categories.map((c) => ({
      id: c.slug,
      label: c.name,
      coverImage: c.image
    }))
  ];

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Header Row */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-[13px] font-black text-ink tracking-tight">
          Browse by Categories
        </h2>
        <button 
          onClick={onViewAll}
          className="text-[11px] font-extrabold text-primary active:scale-95 transition-all"
        >
          See all
        </button>
      </div>

      {/* Horizontal grid/carousel row */}
      <div className="flex items-center gap-3.5 overflow-x-auto pt-1.5 pb-1.5 -mx-4 px-4 no-scrollbar">
        {list.map((cat) => {
          const isActive = selectedCategory === cat.id;
          
          return (
            <div
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {/* Box container with Cover Image */}
              <div
                className={`w-[56px] h-[56px] rounded-[18px] overflow-hidden flex items-center justify-center transition-all duration-300 active:scale-[0.93] ${
                  isActive
                    ? 'ring-2 ring-[#0D9488] ring-offset-1 shadow-sm'
                    : 'border border-line/70 hover:border-slate-300 shadow-sm'
                }`}
              >
                <img
                  src={cat.coverImage}
                  alt={cat.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Label underneath */}
              <span
                className={`text-[9px] font-black tracking-tight leading-none text-center transition-colors ${
                  isActive ? 'text-primary' : 'text-[#64748B]'
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
