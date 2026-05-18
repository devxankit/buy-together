import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm select-none relative mb-6">
      {/* Title & subtitle stack left */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <h3 className="text-[12.5px] font-black text-[#1E293B] leading-tight">
          Can't find what you're looking for?
        </h3>
        <p className="text-[9.5px] font-bold text-[#64748B] leading-snug">
          Create your own group and invite others to join.
        </p>
      </div>

      {/* Button CTA right */}
      <button
        onClick={() => navigate('/groups/create')}
        className="bg-[#0D9488] hover:bg-[#0B7A70] text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0 shadow-sm shadow-[#0D9488]/10"
      >
        + Create Group
      </button>
    </div>
  );
};

export default BottomCTA;
