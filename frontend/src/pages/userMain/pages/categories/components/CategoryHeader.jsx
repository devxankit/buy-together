import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryHeader = ({ categoryTitle = "Smartphones", groupsCount = 128, buyersCount = "2.4K+", description = "Find people who want to buy the same smartphone and get the best deals together." }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4.5 bg-gradient-to-r from-[#0B7A70] to-[#0D9488] px-4 pt-5 pb-6 rounded-b-[26px] shadow-lg shadow-[#0D9488]/15 select-none relative animate-slideDown">
      {/* Row 1: Navigation & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-teal-100 p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <button className="flex items-center gap-1 text-white hover:text-teal-50 active:scale-95 transition-all">
            <span className="text-[19px] font-black tracking-tight leading-none">
              {categoryTitle}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-teal-100/90 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 bg-white/12 hover:bg-white/18 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button className="w-9 h-9 bg-white/12 hover:bg-white/18 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Cover and Summary */}
      <div className="flex gap-4 items-center">
        {/* Cover Photo left */}
        <div className="w-[72px] h-[72px] bg-white rounded-2xl p-1.5 flex items-center justify-center border-2 border-white/30 flex-shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=120&q=80"
            alt="Category Cover"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info stack right */}
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-[11.5px] font-black text-teal-100 tracking-wide uppercase leading-none">
            {groupsCount} Groups <span className="text-teal-200/60">•</span> {buyersCount} Active Buyers
          </p>
          <p className="text-[11.5px] font-semibold text-white/95 leading-normal line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
