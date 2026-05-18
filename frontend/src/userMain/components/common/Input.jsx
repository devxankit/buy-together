import React from 'react';

/**
 * Reusable Input component following UI-RULES.md guidelines.
 * Focuses on rich visuals, high accessibility, and dynamic active states.
 */
const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  id,
  className = '',
  helperText,
  icon,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-ink/80 tracking-wide uppercase px-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-muted pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          type={type}
          className={`
            w-full 
            h-12 
            bg-white 
            border 
            ${error ? 'border-danger focus:ring-danger/20' : 'border-line focus:border-primary focus:ring-primary/20'} 
            rounded-2xl 
            ${icon ? 'pl-11' : 'px-4'} 
            pr-4 
            text-sm 
            font-medium 
            text-ink 
            placeholder:text-faint 
            focus:outline-none 
            focus:ring-4 
            transition-all 
            duration-200
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs font-semibold text-danger px-1 flex items-center gap-1 mt-0.5 animate-fadeIn">
          ⚠ {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-muted px-1 mt-0.5">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
