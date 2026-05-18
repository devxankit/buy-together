import React from 'react';
import { useNavigate } from 'react-router-dom';

const JoinedGroupsList = ({ groups }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 select-none pb-8 animate-fadeIn">
      {groups.map((group) => {
        const percentage = Math.round((group.spotsJoined / group.spotsTotal) * 100);
        const isClosingSoon = group.status === 'closing';

        return (
          <div
            key={group.id}
            className="bg-white border border-[#E2E8F0]/70 hover:border-[#0D9488]/15 rounded-[22px] p-3.5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* ── TOP SECTION (Product Image and Info) ── */}
            <div className="flex gap-3">
              {/* Product Image left */}
              <div className="w-[84px] h-[84px] bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 self-center relative">
                {/* Floating Closing Label top of image */}
                {group.closingLabel && (
                  <div className="absolute top-1 left-1 bg-[#FEF3C7] text-[#D97706] text-[7.5px] font-black px-1.5 py-0.5 rounded-[5px] leading-none uppercase tracking-wide">
                    {group.closingLabel}
                  </div>
                )}
                
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  loading="lazy"
                />

                {/* Floating Member Count bottom of image */}
                <div className="absolute bottom-1 right-1 bg-[#0D9488] px-1.5 py-0.5 rounded-[6px] flex items-center gap-0.5 text-[8px] font-bold text-white shadow-sm shadow-[#0D9488]/10 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2 h-2 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{group.spotsJoined}</span>
                </div>
              </div>

              {/* Product details center */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-[#1E293B] truncate max-w-[125px]">
                      {group.title}
                    </h3>
                    {isClosingSoon ? (
                      <span className="bg-[#FEF3C7] text-[#D97706] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight">
                        Closing Soon
                      </span>
                    ) : (
                      <span className="bg-[#DCFCE7] text-[#15803D] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-[9px] font-extrabold text-[#94A3B8] mt-0.5">
                    {group.category} • {group.location}
                  </p>

                  <p className="text-[9.5px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-1">
                    {group.slogan}
                  </p>
                </div>

                {/* Progress bar line with percentage */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-[5px] bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[9.5px] font-bold text-[#0D9488]">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Right column indicators */}
              <div className="flex flex-col items-end justify-between flex-shrink-0 pl-1 self-stretch">
                {/* Spots progress stack */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0]/50 px-2 py-1 rounded-xl text-center min-w-[56px]">
                  <p className="text-[9.5px] font-black text-[#1E293B] leading-none">
                    {group.spotsJoined}/{group.spotsTotal}
                  </p>
                  <p className="text-[8px] font-bold text-[#94A3B8] mt-0.5 leading-none">
                    Buyers
                  </p>
                </div>

                {/* Time left */}
                <div
                  className={`flex items-center gap-0.5 text-[9px] font-bold ${
                    isClosingSoon ? 'text-[#EF4444]' : 'text-[#94A3B8]'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-2.5 h-2.5 ${isClosingSoon ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{group.daysLeft}</span>
                </div>
              </div>
            </div>

            {/* ── DIVIDING LINE ── */}
            <div className="border-t border-[#F1F5F9]" />

            {/* ── BOTTOM SECTION (Metrics Columns & CTA) ── */}
            <div className="flex items-center justify-between gap-2.5 pt-0.5">
              {/* Metrics grid */}
              <div className="flex-1 grid grid-cols-3 gap-2">
                {/* Column 1: Target Price */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-[#94A3B8]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20a1 1 0 02-1-1v-2.586a1 1 0 01.293-.707l7.534-7.534a1 1 0 021.414 0l2.586 2.586a1 1 0 020 1.414l-7.534 7.534a1 1 0 01-.707.293H6z" />
                    </svg>
                    <span>Target Price</span>
                  </div>
                  <p className="text-[10px] font-black text-[#475569] leading-tight">
                    {group.targetPrice}
                  </p>
                </div>

                {/* Column 2: Best Offer */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-[#94A3B8]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Best Offer</span>
                  </div>
                  <p className="text-[10px] font-black text-[#15803D] leading-tight">
                    {group.bestOffer}
                  </p>
                </div>

                {/* Column 3: My Interest */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-[#94A3B8]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>My Interest</span>
                  </div>
                  <p className="text-[10px] font-black text-[#475569] leading-tight">
                    {group.myInterest}
                  </p>
                </div>
              </div>

              {/* View Group Button CTA */}
              <button
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-white hover:bg-[#0D9488]/5 text-[#0D9488] border border-[#0D9488]/25 hover:border-[#0D9488]/40 px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all duration-200 active:scale-95 flex-shrink-0 self-center"
              >
                View Group
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JoinedGroupsList;
