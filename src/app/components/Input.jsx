import React from 'react';

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-all duration-200 placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus ${
          error ? 'border-rose-500/50 focus:border-rose-500' : ''
        }`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-[10px] uppercase tracking-wider text-ink-muted font-medium select-none">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-surface-1 border border-hairline hover:border-hairline-strong focus:border-brand-primary rounded-md p-3 text-xs text-ink outline-none transition-all duration-200 resize-none font-mono placeholder:text-ink-tertiary focus:ring-1 focus:ring-brand-primary-focus ${
          error ? 'border-rose-500/50 focus:border-rose-500' : ''
        }`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
}
