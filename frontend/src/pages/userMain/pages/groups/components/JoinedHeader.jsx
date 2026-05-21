import React from 'react';

const JoinedHeader = ({ onBackClick }) => {
  return (
    <div className="flex flex-col gap-2.5 bg-gradient-to-r from-[#0B7A70] to-[#0D9488] px-4 pt-5 pb-6 -mx-3.5 mt-[-14px] rounded-b-[26px] shadow-lg shadow-[#0D9488]/15 select-none relative animate-slideDown">
      <div className="flex items-center justify-between">
        {/* Back navigation & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackClick}
            className="text-white hover:text-teal-100 p-1.5 rounded-full hover:bg-surface/10 active:scale-90 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-[19px] font-black tracking-tight text-white leading-tight">
              Joined Groups
            </h1>
            <p className="text-[10px] font-bold text-teal-100/90 leading-none mt-0.5">
              Groups you are a part of
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 bg-surface/12 hover:bg-surface/18 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button className="w-9 h-9 bg-surface/12 hover:bg-surface/18 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all active:scale-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinedHeader;
