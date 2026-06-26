import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components';
import { toggleWishlist } from '../../../../../redux/slices/wishlistSlice';
import WishlistButton from '../../../../../components/ui/WishlistButton';
import { cldImg } from '../../../../../utils/imageUrl';

/**
 * Modular component for active group purchasing pools in a scrollable horizontal carousel.
 */
const HotGroupsCarousel = ({ title = 'Hot Buying Groups', groups, onGroupClick, onViewAll }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="flex flex-col gap-3">
      {/* Header section */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">{title}</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-primary flex items-center gap-0.5 active:scale-95 transition-all"
        >
          See All
          <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipeable Horizontal Scroll Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5 select-none">
        {groups.map((group) => {
          const progressPercent = (group.spotsJoined / group.spotsTotal) * 100;
          const isWishlisted = wishlistItems.some(item => String(item.id || item._id) === String(group.id || group._id));
          // Mock interest counts (derive from spotsJoined if not explicitly provided)
          const seriousCount = group.seriousCount ?? Math.floor(group.spotsJoined * 0.35);
          const readyCount = group.readyCount ?? Math.floor(group.spotsJoined * 0.18);
          
          return (
            <Card
              key={group.id}
              onClick={() => onGroupClick(group.id)}
              padding="p-0"
              className="w-[152px] flex-shrink-0 flex flex-col shadow-card overflow-hidden"
            >
              {/* Product Image Panel with Floating Status tag */}
              <div className="w-full h-[95px] bg-[#F6F6F8] relative overflow-hidden flex-shrink-0">
                <img
                  src={cldImg(group.image, { w: 320, h: 190 })}
                  alt={group.title}
                  className="absolute inset-0 w-full h-full object-cover block"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Wishlist Button */}
                <WishlistButton
                  isWishlisted={isWishlisted}
                  onClick={() => dispatch(toggleWishlist(group))}
                  className="absolute top-2 right-2 z-10"
                />
                
                {/* Floating Joined counter badge */}
                <div className="absolute right-2 bottom-2 bg-surface/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-line/10 scale-[0.88] origin-bottom-right z-10">
                  <span className="text-[9.5px] font-black text-primary leading-none">
                    {group.spotsJoined}
                  </span>
                  <span className="text-[8px] font-black text-muted leading-none">want this</span>
                </div>
              </div>

              {/* Info Text & Progress wrapped in padding */}
              <div className="p-2.5 pt-2 flex flex-col gap-1.5 flex-1 justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <h4 className="text-[12.5px] font-extrabold text-ink leading-tight tracking-tight truncate">
                    {group.title}
                  </h4>
                  <span className="text-[9.5px] font-bold text-primary mt-0.5 leading-none truncate max-w-full block">
                    {group.subtitle}
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="flex flex-col gap-1 mt-auto">
                  <div className="w-full h-1 bg-surface-deep rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-muted mt-0.5 leading-none">
                    <span>{group.spotsJoined}/{group.spotsTotal} buyers</span>
                    <span className="text-danger flex items-center gap-0.5">
                      ⏱ {group.daysLeft.split(' ')[0]}
                    </span>
                  </div>

                  {/* Serious & Ready to Buy stats row */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-line/50 mt-0.5">
                    <div className="flex items-center gap-0.5 flex-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-[8.5px] font-black text-ink leading-none">{seriousCount}</span>
                      <span className="text-[7.5px] font-semibold text-muted leading-none">serious</span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-[8.5px] font-black text-ink leading-none">{readyCount}</span>
                      <span className="text-[7.5px] font-semibold text-muted leading-none">ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HotGroupsCarousel;

