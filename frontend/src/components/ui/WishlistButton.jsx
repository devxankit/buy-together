import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistButton = ({ isWishlisted, onClick, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isWishlisted) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1500);
    }
    onClick(e);
  };

  const hasAbsolute = className.includes('absolute');
  const basePosition = hasAbsolute ? '' : 'relative';

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      className={`${basePosition} p-1.5 bg-surface/80 backdrop-blur-sm rounded-full transition-colors active:scale-95 text-muted hover:text-red-500 shadow-sm flex items-center justify-center border border-line/10 ${className}`}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -25, scale: 1 }}
            exit={{ opacity: 0, y: -35, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap bg-ink text-surface text-[10px] font-bold px-2 py-1 rounded-md shadow-lg z-50 flex items-center gap-1"
          >
            <span>✨</span> Saved!
          </motion.div>
        )}
      </AnimatePresence>
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-3.5 h-3.5" 
        fill={isWishlisted ? "#EF4444" : "none"} 
        viewBox="0 0 24 24" 
        stroke={isWishlisted ? "#EF4444" : "currentColor"} 
        strokeWidth={2}
        initial={false}
        animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 15 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </motion.svg>
    </motion.button>
  );
};

export default WishlistButton;
