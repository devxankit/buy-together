import React from 'react';

/**
 * Reusable Badge component following UI-RULES.md.
 * Designed to showcase ratings, verified tags, and group buy spots beautifully.
 */
const Badge = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral'
  size = 'md',        // 'sm' | 'md'
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1 font-semibold rounded-full select-none';
  
  const variants = {
    primary: 'bg-primary-soft text-primary',
    secondary: 'bg-info-soft text-info',
    success: 'bg-[#E4F5EC] text-success',
    danger: 'bg-danger-soft text-danger',
    warning: 'bg-[#FEF3C7] text-[#D97706]',
    neutral: 'bg-surface-deep text-muted',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-[11.5px] px-3 py-1',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
