import React from 'react';

const MyCategoriesCarousel = ({ selectedCategory, onChange }) => {
  const CATEGORIES = [
    {
      id: 'smartphones',
      label: 'Smartphones',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'laptops',
      label: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'appliances',
      label: 'Appliances',
      image: 'https://images.unsplash.com/photo-1610557892470-76d74cd120a8?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'electronics',
      label: 'Electronics',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'fashion',
      label: 'Fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 'home-living',
      label: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=100&q=80'
    }
  ];

  return (
    <div className="flex flex-col gap-2.5 select-none">
      {/* Title Row */}
      <div className="flex items-center">
        <h2 className="text-[14px] font-extrabold text-[#1E293B]">
          Categories
        </h2>
      </div>

      {/* Horizontal Carousel List */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1.5 -mx-3.5 px-3.5 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              {/* Outer circle with offset active ring border */}
              <div
                className={`w-[60px] h-[60px] rounded-full bg-white border border-[#E2E8F0] p-1 flex items-center justify-center transition-all duration-300 active:scale-[0.93] ${
                  isActive
                    ? 'ring-[2.2px] ring-[#0D9488] ring-offset-[1.5px] shadow-sm'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 p-1 flex items-center justify-center">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-contain mix-blend-multiply"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight font-black transition-colors ${
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
