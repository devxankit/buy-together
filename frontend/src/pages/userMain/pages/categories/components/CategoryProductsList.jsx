import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryProductsList = ({ products }) => {
  const navigate = useNavigate();

  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80'
  ];

  return (
    <div className="flex flex-col gap-4 select-none pb-4 animate-fadeIn">
      {products.map((prod) => {
        const percentage = Math.round((prod.spotsJoined / prod.spotsTotal) * 100);
        const isClosingSoon = prod.status === 'closing';

        return (
          <div
            key={prod.id}
            className="bg-white border border-[#E2E8F0]/70 hover:border-[#0D9488]/15 rounded-[22px] p-3.5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            {/* Three dots actions menu */}
            <button className="absolute top-3.5 right-3.5 text-[#94A3B8] hover:text-[#64748B] p-1 rounded-full hover:bg-slate-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* ── TOP SECTION (Product Image and Info) ── */}
            <div className="flex gap-3 pr-4">
              {/* Product Image left */}
              <div className="w-[84px] h-[84px] bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 self-center relative">
                <img
                  src={prod.image}
                  alt={prod.title}
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
                  <span>{prod.spotsJoined}</span>
                </div>
              </div>

              {/* Product details center */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  {/* Highlights (Trending or Closing Soon) */}
                  {prod.highlightLabel && (
                    <div className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-[5px] self-start mb-1 inline-flex items-center gap-0.5 leading-none ${
                      isClosingSoon
                        ? 'bg-[#FEE2E2] text-[#EF4444]'
                        : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span>{prod.highlightLabel}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-[#1E293B] truncate max-w-[120px]">
                      {prod.title}
                    </h3>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight ${
                      isClosingSoon
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}>
                      {prod.statusLabel}
                    </span>
                  </div>

                  <p className="text-[9px] font-extrabold text-[#94A3B8] mt-0.5">
                    {prod.brand} • {prod.location}
                  </p>

                  <p className="text-[9.5px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-1">
                    {prod.slogan}
                  </p>

                  {/* Overlapping Buyers Avatars stack */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {AVATARS.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt="buyer avatar"
                          className="w-4.5 h-4.5 rounded-full border border-white object-cover"
                        />
                      ))}
                    </div>
                    <span className="text-[9.5px] font-black text-[#64748B] leading-none">
                      +{prod.extraCount}
                    </span>
                  </div>
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
              <div className="flex flex-col items-end justify-between flex-shrink-0 self-stretch pt-6 pl-1">
                {/* Spots progress stack */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0]/50 px-2 py-1.5 rounded-xl text-center min-w-[56px]">
                  <p className="text-[9.5px] font-black text-[#1E293B] leading-none">
                    {prod.spotsJoined}/{prod.spotsTotal}
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
                  <span>{prod.daysLeft}</span>
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
                    {prod.targetPrice}
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
                    {prod.bestOffer}
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
                    {prod.myInterest}
                  </p>
                </div>
              </div>

              {/* View Group Button CTA */}
              <button
                onClick={() => navigate(`/groups/${prod.id}`)}
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

export default CategoryProductsList;
