import React from 'react';

/**
 * Modular component for regional group purchases in a swipeable horizontal carousel.
 */
const NearYouCarousel = ({ groups, onGroupClick, onViewAll }) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Header section */}
      <div className="flex justify-between items-center px-1">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-ink">Groups Near You</h3>
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

      {/* Scrollable listing panel */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5 select-none">
        {groups.map((near) => (
          <div
            key={near.id}
            onClick={() => onGroupClick(near.id)}
            className="w-[155px] flex-shrink-0 flex flex-col gap-2 cursor-pointer active:scale-[0.98] transition-all"
          >
            {/* Region image with user counter bubble overlay */}
            <div className="w-full h-[105px] rounded-[20px] overflow-hidden relative shadow-card border border-line/40">
              <img
                src={near.image}
                alt={near.title}
                className="w-full h-full object-cover"
              />
              
              {/* Floating count badge overlay */}
              <div className="absolute right-2.5 bottom-2.5 bg-primary/95 text-white text-[9.5px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>{near.buyersCount}</span>
              </div>
            </div>

            {/* Title & Proximity Subtext */}
            <div className="flex flex-col px-1 leading-tight">
              <h4 className="text-[12.5px] font-extrabold text-ink tracking-tight truncate">
                {near.title}
              </h4>
              <span className="text-[9.5px] font-bold text-muted mt-0.5 leading-none">
                {near.distance}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearYouCarousel;
