import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrendingGroups = ({ groups }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Header section with See All */}
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-ink">
          Trending Right Now
        </h2>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-bold text-primary hover:text-[#0B7A70] flex items-center gap-0.5 active:scale-95 transition-all"
        >
          <span>See All</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 -mx-3.5 px-3.5 no-scrollbar">
        {groups.map((group) => {
          const percentage = (group.spotsJoined / group.spotsTotal) * 100;
          return (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}/chat`, { state: { group, isJoined: false } })}
              className="w-[140px] bg-surface border border-line/70 hover:border-primary/20 rounded-2xl p-2.5 flex flex-col gap-2 relative shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] cursor-pointer flex-shrink-0"
            >
              {/* Floating Buyers Badge */}
              <div className="absolute top-2 right-2 bg-primary-soft/90 border border-primary/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] font-bold text-primary z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-2.5 h-2.5 text-primary"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>{group.spotsJoined}</span>
              </div>

              {/* Product Image Container */}
              <div className="w-full h-[95px] rounded-xl overflow-hidden bg-surface-alt flex items-center justify-center p-1">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-contain "
                  loading="lazy"
                />
              </div>

              {/* Title, Discount, Progress stack */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h3 className="text-[11px] font-extrabold text-ink truncate leading-tight">
                  {group.title}
                </h3>
                
                {/* Green OFF Badge */}
                <div className="bg-[#DCFCE7] text-[#15803D] text-[9.5px] font-black px-1.5 py-0.5 rounded-[5px] self-start leading-none tracking-tight truncate max-w-full">
                  {group.subtitle}
                </div>

                <div className="mt-auto pt-1 flex flex-col gap-1">
                  {/* Progress string */}
                  <span className="text-[9px] font-bold text-[#64748B]">
                    {group.spotsJoined} / {group.spotsTotal} buyers
                  </span>

                  {/* Days left */}
                  <div className="flex items-center gap-1 text-[8.5px] font-semibold text-muted">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-2.5 h-2.5 text-muted"
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingGroups;
