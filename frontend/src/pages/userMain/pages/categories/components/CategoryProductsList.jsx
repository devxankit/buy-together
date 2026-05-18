import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Premium redesigned CategoryProductsList matching the custom cards layout from user mockup.
 * Incorporates:
 *  - Boxless left image rendered directly inside the card (size reduced to 72px)
 *  - Floating trending corner badge relative to the image
 *  - Inline title verify checkmark badge & member counts
 *  - Full location pin & creator profile avatar details
 *  - Subtle linear progress indicators alongside remaining metrics
 *  - Bottom row with hashtag chips and custom outline action buttons
 */
const CategoryProductsList = ({ products }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 select-none pb-4 animate-fadeIn">
      {products.map((prod) => {
        const percentage = Math.round((prod.spotsJoined / prod.spotsTotal) * 100);
        
        // Define badge styles dynamically based on badgeType
        let badgeBg = 'bg-[#FEF3C7] text-[#D97706]'; // Default yellow
        if (prod.badgeType === 'hot') {
          badgeBg = 'bg-[#FFEDED] text-[#EF4444]'; // soft red/orange background
        } else if (prod.badgeType === 'rising') {
          badgeBg = 'bg-[#E8F8F5] text-[#0D9488]'; // soft teal/green background
        } else if (prod.badgeType === 'new') {
          badgeBg = 'bg-[#E0F2FE] text-[#0284C7]'; // soft blue background
        }

        return (
          <div
            key={prod.id}
            className="bg-white border border-[#E2E8F0]/70 rounded-[22px] p-3.5 flex gap-3.5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* ── LEFT: DIRECT IMAGE (No visual styled box container!) ── */}
            <div className="relative w-[72px] h-[72px] flex-shrink-0 self-center">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover rounded-[14px]"
                loading="lazy"
              />

              {/* Floating Badge on top-left of image */}
              <div className={`absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-[4.5px] text-[6.5px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5 leading-none ${badgeBg}`}>
                <span className="w-0.5 h-0.5 rounded-full bg-current animate-pulse flex-shrink-0" />
                <span>{prod.badgeLabel || 'HOT'}</span>
              </div>
            </div>

            {/* ── RIGHT: DETAILS BLOCK ── */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              
              {/* Row 1: Title + Verified Badge AND Member Count */}
              <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <h3 className="text-[12px] font-black text-[#1E293B] truncate leading-tight">
                    {prod.title}
                  </h3>
                  {/* Verified checkmark SVG in purple-teal */}
                  <svg className="w-3 h-3 text-[#7C3AED] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Member indicators: 324/500 members */}
                <div className="flex items-center gap-0.5 text-[#0D9488] flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#0D9488]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-[9px] font-extrabold text-[#0D9488] tracking-tight leading-none">
                    {prod.spotsJoined}/{prod.spotsTotal}
                    <span className="text-[#94A3B8] font-bold text-[8px] ml-0.5">members</span>
                  </span>
                </div>
              </div>

              {/* Row 2: Description text */}
              <p className="text-[9.5px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-0.5 pr-1">
                {prod.slogan}
              </p>

              {/* Row 3: Location and Creator Details */}
              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                {/* Location */}
                <div className="flex items-center gap-0.5 text-[#64748B] flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[9px] font-extrabold">{prod.location}</span>
                </div>

                {/* Creator info */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <img
                    src={prod.creatorAvatar}
                    alt={prod.creatorName}
                    className="w-4 h-4 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <span className="text-[9px] font-bold text-[#64748B]">
                    Created by <span className="text-[#1E293B] font-extrabold">{prod.creatorName}</span>
                  </span>
                </div>
              </div>

              {/* Row 4: Progress Bar + Needed count */}
              <div className="flex items-center justify-between gap-3 mt-1.5">
                <div className="flex-1 h-[5px] bg-slate-100 rounded-full overflow-hidden border border-slate-200/10 relative">
                  <div
                    className="h-full bg-gradient-to-r from-[#0B7A70] to-[#0D9488] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[8.5px] font-bold text-[#64748B] flex-shrink-0">
                  {prod.daysLeft}
                </span>
              </div>

              {/* Row 5: Tags Row AND CTA Join Group Button */}
              <div className="flex items-center justify-between gap-2 mt-2">
                {/* Hashtags list */}
                <div className="flex items-center gap-1 flex-wrap">
                  {(prod.hashtags || []).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-[#E8F8F5] text-[#0D9488] text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none tracking-tight"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Join Group / View Group Button */}
                <button
                  onClick={() => navigate(`/groups/${prod.id}`)}
                  className="border border-[#0D9488] hover:bg-[#0D9488]/5 text-[#0D9488] px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all duration-200 active:scale-95 flex-shrink-0"
                >
                  Join Group
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProductsList;
