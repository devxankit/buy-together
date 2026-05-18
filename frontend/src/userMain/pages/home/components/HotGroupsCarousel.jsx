import React from 'react';
import { Card } from '../../../components';

/**
 * Modular component for active group purchasing pools in a scrollable horizontal carousel.
 */
const HotGroupsCarousel = ({ groups, onGroupClick, onViewAll }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header section */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">Hot Buying Groups</h3>
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
          return (
            <Card
              key={group.id}
              onClick={() => onGroupClick(group.id)}
              padding="p-3"
              className="w-[145px] flex-shrink-0 flex flex-col gap-2 shadow-card"
            >
              {/* Product Image Panel with Floating Status tag */}
              <div className="w-full h-[95px] bg-[#F6F6F8] rounded-xl overflow-hidden flex items-center justify-center relative">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Joined counter badge */}
                <div className="absolute right-1.5 bottom-1.5 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-line/10 scale-[0.88] origin-bottom-right">
                  <span className="text-[9.5px] font-black text-primary leading-none">
                    {group.spotsJoined}
                  </span>
                  <span className="text-[8px] font-black text-muted leading-none">want this</span>
                </div>
              </div>

              {/* Info Text */}
              <div className="flex flex-col">
                <h4 className="text-[12.5px] font-extrabold text-ink leading-tight tracking-tight truncate">
                  {group.title}
                </h4>
                <span className="text-[9.5px] font-bold text-primary mt-0.5 leading-none">
                  {group.subtitle}
                </span>
              </div>

              {/* Progress bar visualizer */}
              <div className="flex flex-col gap-1 mt-0.5">
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
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HotGroupsCarousel;
