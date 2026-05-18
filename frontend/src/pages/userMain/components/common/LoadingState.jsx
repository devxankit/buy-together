import React from 'react';

/**
 * Reusable LoadingState component adhering to UI-RULES.md feedback rules.
 * Supports elegant spinners and modern skeleton screens for group items.
 */
export const LoadingState = ({
  variant = 'spinner', // 'spinner' | 'skeleton' | 'full'
  className = '',
  rows = 3
}) => {
  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <svg
          className="animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={`flex flex-col gap-4 w-full animate-pulse ${className}`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="bg-white border border-line/40 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-surface-deep rounded-md w-1/3" />
              <div className="h-4 bg-surface-deep rounded-md w-12" />
            </div>
            <div className="h-3 bg-surface-deep rounded-md w-3/4" />
            <div className="flex gap-2 mt-2">
              <div className="h-8 bg-surface-deep rounded-xl w-24" />
              <div className="h-8 bg-surface-deep rounded-xl w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full-page micro-interactive loader
  return (
    <div className={`fixed inset-0 bg-[#F6F6F8]/80 backdrop-blur-md flex flex-col items-center justify-center z-[999] ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute w-8 h-8 bg-primary/10 rounded-full animate-ping" />
      </div>
      <p className="mt-4 text-xs font-semibold text-ink/75 uppercase tracking-widest animate-pulse">
        Loading together...
      </p>
    </div>
  );
};

export default LoadingState;
