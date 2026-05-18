import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Premium bottom CTA banner.
 * Provides custom group creation card styled strictly in our project theme.
 */
const BottomCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#EBF9F7] border border-[#0D9488]/12 p-3.5 rounded-[22px] flex items-center justify-between gap-3 shadow-sm select-none relative mb-6">
      
      {/* Icon & Title stack left */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Rounded group icon box */}
        <div className="w-[38px] h-[38px] rounded-xl bg-white border border-[#0D9488]/10 flex items-center justify-center text-[#0D9488] flex-shrink-0 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>

        {/* Text stack */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-[11.5px] font-black text-[#1E293B] leading-none">
            Create your own group
          </h3>
          <p className="text-[9px] font-bold text-[#64748B] leading-tight">
            Bring people together and get better deals!
          </p>
        </div>
      </div>

      {/* Button CTA right */}
      <button
        onClick={() => navigate('/groups/create')}
        className="bg-[#0D9488] hover:bg-[#0B7A70] text-white text-[9.5px] font-extrabold px-3.5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0 shadow-md shadow-[#0D9488]/15 flex items-center gap-0.5"
      >
        <span>Create Group</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default BottomCTA;
