import React from 'react';
import { useNavigate } from 'react-router-dom';

const AllGroupsList = ({ groups, onSortChange }) => {
  const navigate = useNavigate();

  // Overlapping avatar assets
  const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80'
  ];

  return (
    <div className="flex flex-col gap-3 select-none pb-4">
      {/* Header section with sorting options */}
      <div className="flex items-center justify-between mt-1">
        <h2 className="text-[15px] font-extrabold text-[#1E293B]">
          All Groups
        </h2>
        <button
          onClick={onSortChange}
          className="text-xs font-bold text-[#64748B] hover:text-[#475569] flex items-center gap-0.5 active:scale-95 transition-all"
        >
          <span>Sort: Recently Active</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-[#94A3B8] ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Vertical Groups List */}
      <div className="flex flex-col gap-3.5">
        {groups.map((group) => {
          const percentage = (group.spotsJoined / group.spotsTotal) * 100;
          const isClosingSoon = group.status === 'closing';

          return (
            <div
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
              className="bg-white border border-[#E2E8F0]/70 hover:border-[#0D9488]/15 rounded-2xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.99] cursor-pointer"
            >
              {/* Product Image on the left */}
              <div className="w-[84px] h-[84px] bg-[#F8FAFC] border border-[#E2E8F0]/40 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0 self-center">
                <img
                  src={group.image}
                  alt={group.title}
                  className="w-full h-full object-contain mix-blend-multiply"
                  loading="lazy"
                />
              </div>

              {/* Middle Section: Group details & Avatars */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  {/* Title & Status Badge row */}
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

                  {/* Location & Category string */}
                  <p className="text-[9.5px] font-extrabold text-[#94A3B8] mt-0.5">
                    {group.category} • {group.location}
                  </p>

                  {/* Slogan */}
                  <p className="text-[10px] font-semibold text-[#64748B] leading-tight line-clamp-2 mt-1">
                    {group.slogan}
                  </p>
                </div>

                {/* Avatar stack and Progress bar stack */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {/* Overlapping Avatar Stack */}
                  <div className="flex items-center flex-shrink-0">
                    {AVATARS.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="Member avatar"
                        className="w-5 h-5 rounded-full border border-white object-cover -mr-1.5"
                        style={{ zIndex: 3 - idx }}
                      />
                    ))}
                    <div className="w-5 h-5 rounded-full bg-[#E2E8F0] border border-white text-[8px] font-black text-[#475569] flex items-center justify-center -mr-1.5 z-[0]">
                      +{group.spotsJoined - 3 > 0 ? group.spotsJoined - 3 : 9}
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="flex-1 min-w-[70px] h-[5px] bg-[#F1F5F9] rounded-full overflow-hidden self-center">
                    <div
                      className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Section: 3-dots, spots indicator & time */}
              <div className="flex flex-col items-end justify-between flex-shrink-0 pl-1">
                {/* 3-dots menu button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // trigger quick context menu action if desired
                  }}
                  className="text-[#94A3B8] hover:text-[#64748B] p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Spots Progress Stack Box */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0]/50 px-2 py-1.5 rounded-xl text-center min-w-[60px]">
                  <p className="text-[10px] font-black text-[#1E293B] leading-none">
                    {group.spotsJoined}/{group.spotsTotal}
                  </p>
                  <p className="text-[8.5px] font-bold text-[#94A3B8] mt-0.5 leading-none">
                    Buyers
                  </p>
                </div>

                {/* Clock indicator & Time left */}
                <div
                  className={`flex items-center gap-0.5 text-[9.5px] font-bold ${
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
          );
        })}
      </div>
    </div>
  );
};

export default AllGroupsList;
