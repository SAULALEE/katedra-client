import React from 'react';

export default function Button({
  children,
  variant = 'secondary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,
}) {
  const baseClasses = 'inline-flex items-center justify-center font-sans text-xs font-medium rounded-md px-4 py-2.5 transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-[0_0_15px_rgba(5,43,88,0.3)] hover:shadow-[0_0_20px_rgba(5,43,88,0.5)] focus:ring-2 focus:ring-brand-primary-focus focus:outline-none',
    secondary: 'bg-surface-1 hover:bg-surface-2 border border-hairline text-ink hover:text-ink focus:ring-1 focus:ring-hairline-strong focus:outline-none',
    tertiary: 'bg-canvas hover:bg-surface-1 border border-transparent hover:border-hairline text-ink-muted hover:text-ink focus:outline-none',
    inverse: 'bg-inverse-canvas hover:bg-inverse-surface-1 text-inverse-ink font-semibold focus:outline-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {children}
    </button>
  );
}
