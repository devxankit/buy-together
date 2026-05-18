import React from 'react';

/**
 * Reusable Custom Button following UI-RULES.md and theme-rules.md guidelines.
 * Features built-in micro-animations (active scaling) and custom tactile states.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'soft' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 shadow-md shadow-primary/10',
    secondary: 'border border-primary text-primary hover:bg-primary-soft/10',
    soft: 'bg-primary-soft text-primary hover:bg-primary-soft/85',
    danger: 'bg-danger text-white hover:opacity-90 shadow-md shadow-danger/10',
    ghost: 'text-muted hover:text-ink hover:bg-surface-alt',
  };

  const sizes = {
    sm: 'h-10 px-4 text-sm rounded-xl',
    md: 'h-12 px-6 text-[15px] rounded-2xl',
    lg: 'h-14 px-8 text-base rounded-[20px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-current"
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
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
