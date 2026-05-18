import React from 'react';

const PromoBanner = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-3 bg-[#E6F4F2]/50 border border-[#0D9488]/10 p-3.5 rounded-2xl relative transition-all duration-300 animate-fadeIn select-none">
      {/* Custom Teal Circular Group Avatar Icon */}
      <div className="w-10 h-10 bg-[#0D9488]/15 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#0D9488]/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#0D9488]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>

      {/* Main Text Content */}
      <div className="pr-6 flex-1">
        <p className="text-[11.5px] leading-relaxed text-[#334155] font-semibold">
          Create or join a group to buy together and unlock{' '}
          <span className="text-[#0D9488] font-bold">better prices</span> on your
          favorite products.
        </p>
      </div>

      {/* Close Action Button */}
      <button
        onClick={onClose}
        className="absolute top-3.5 right-3.5 text-[#94A3B8] hover:text-[#64748B] transition-colors p-0.5 rounded-full hover:bg-slate-100/80 active:scale-90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default PromoBanner;
