import React from 'react';

const SubcategoriesCarousel = ({ selectedSub, onChange }) => {
  const SUB_CATEGORIES = [
    {
      id: 'all',
      label: 'All Smartphones',
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
      id: 'iphone',
      label: 'iPhone',
      icon: (
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.97.08 2.15-.52 2.81-1.33z" />
        </svg>
      )
    },
    {
      id: 'samsung',
      label: 'Samsung',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'oneplus',
      label: 'OnePlus',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      id: 'xiaomi',
      label: 'Xiaomi',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
        </svg>
      )
    },
    {
      id: 'oppo',
      label: 'Oppo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
          <ellipse cx="12" cy="12" rx="7" ry="5" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-2.5 select-none">
      <h2 className="text-[14px] font-extrabold text-ink">
        Subcategories
      </h2>

      {/* Horizontal Pills list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-3.5 px-3.5 no-scrollbar">
        {SUB_CATEGORIES.map((sub) => {
          const isActive = selectedSub === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => onChange(sub.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 duration-200 border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-[#64748B] hover:text-[#475569] border-line hover:border-[#CBD5E1]'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubcategoriesCarousel;
