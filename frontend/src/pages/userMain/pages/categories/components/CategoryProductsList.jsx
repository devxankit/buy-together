import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';

/**
 * Premium redesigned CategoryProductsList matching the custom cards layout from user mockup.
 * Incorporates:
 *  - Boxless left image rendered directly inside the card (size reduced to 72px)
 *  - Floating trending corner badge relative to the image
 *  - Inline title verify checkmark badge & member counts
 *  - Full location pin & creator profile avatar details
 *  - Subtle linear progress indicators alongside remaining metrics
 *  - Bottom row with custom outline action buttons
 */
const CategoryProductsList = ({ products, onJoin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="flex flex-col gap-4 select-none pb-4 animate-fadeIn">
      {products.map((prod) => {
        const percentage = Math.round((prod.spotsJoined / prod.spotsTotal) * 100);
        
        // Define badge styles dynamically based on badgeType
        let badgeBg = 'bg-[#FEF3C7] text-[#D97706]'; // Default yellow
        if (prod.badgeType === 'hot') {
          badgeBg = 'bg-[#FFEDED] text-[#EF4444]'; // soft red/orange background
        } else if (prod.badgeType === 'rising') {
          badgeBg = 'bg-[#E8F8F5] text-primary'; // soft teal/green background
        } else if (prod.badgeType === 'new') {
          badgeBg = 'bg-[#E0F2FE] text-[#0284C7]'; // soft blue background
        }

        return (
          <div
            key={prod.id}
            onClick={() => navigate(`/groups/${prod.id}`)}
            className="bg-surface border border-line/70 rounded-[22px] p-3.5 flex gap-3.5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.99]"
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
            <div className="flex-1 flex flex-col min-w-0 gap-1.5">

              {/* Row 1: Title + verified · members count */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  <h3 className="text-[12.5px] font-black text-ink truncate leading-tight">
                    {prod.title}
                  </h3>
                  <svg className="w-3 h-3 text-[#7C3AED] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.13-5.69z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="flex items-center gap-0.5 text-primary flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-[9.5px] font-extrabold tracking-tight leading-none">
                    {prod.spotsJoined}/{prod.spotsTotal}
                  </span>
                </div>
              </div>

              {/* Row 2: Slogan (single line keeps every card the same height) */}
              <p className="text-[9.5px] font-semibold text-[#64748B] leading-snug line-clamp-1">
                {prod.slogan}
              </p>

              {/* Row 3: Meta — location · creator */}
              <div className="flex items-center gap-1.5 min-w-0 text-[9px] text-[#64748B]">
                <span className="flex items-center gap-0.5 flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-bold">{prod.location}</span>
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-slate-300 flex-shrink-0" />
                <span className="flex items-center gap-1 min-w-0">
                  <img
                    src={prod.creatorAvatar}
                    alt={prod.creatorName}
                    className="w-3.5 h-3.5 rounded-full object-cover border border-line flex-shrink-0"
                  />
                  <span className="font-bold truncate">{prod.creatorName}</span>
                </span>
              </div>

              {/* Row 4: Progress bar + percentage */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[5px] bg-surface-alt rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0B7A70] to-[#0D9488] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[8.5px] font-black text-primary flex-shrink-0">{percentage}%</span>
              </div>

              {/* Row 5: Needed count (left) · wishlist + Join (right) */}
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[9px] font-bold text-[#64748B] min-w-0">
                  <svg className="w-2.5 h-2.5 text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{prod.daysLeft}</span>
                </span>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <WishlistButton
                    isWishlisted={wishlistItems.some(item => String(item.id || item._id) === String(prod.id || prod._id))}
                    onClick={() => dispatch(toggleWishlist(prod))}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onJoin) {
                        onJoin(e, prod);
                      } else {
                        navigate(`/groups/${prod.id}/chat`, { state: { group: prod, isJoined: false } });
                      }
                    }}
                    className="border border-primary hover:bg-primary/5 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black transition-all duration-200 active:scale-95"
                  >
                    Join Group
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProductsList;
