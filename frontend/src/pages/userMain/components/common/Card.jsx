import React from 'react';

/**
 * Reusable Card component adhering to UI-RULES.md and theme-rules.md.
 * Provides subtle shadows, rounded-2xl/rounded-3xl corners, and customizable hover animations.
 */
const Card = ({
  children,
  onClick,
  className = '',
  hoverEffect = false,
  padding = 'p-5',
  rounded = 'rounded-2xl', // 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl'
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface 
        border border-line/60 
        shadow-card 
        ${rounded} 
        ${padding} 
        ${onClick ? 'cursor-pointer' : ''}
        ${hoverEffect && onClick ? 'hover:-translate-y-1 hover:shadow-xl-card active:scale-[0.98]' : ''}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
