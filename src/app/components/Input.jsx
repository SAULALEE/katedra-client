
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
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-extrabold uppercase tracking-[1.5px] text-ink-muted select-none mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-surface-2 border border-hairline hover:border-hairline-strong focus:border-brand-secure focus:bg-surface-1 rounded-xl py-3.5 px-4 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink-tertiary focus:ring-4 focus:ring-brand-secure/10 ${
          error ? 'border-rose-500/50 focus:border-rose-500' : ''
        }`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1.5">{error}</p>}
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
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-extrabold uppercase tracking-[1.5px] text-ink-muted select-none mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-surface-2 border border-hairline hover:border-hairline-strong focus:border-brand-secure focus:bg-surface-1 rounded-xl py-3.5 px-4 text-sm text-ink outline-none transition-all duration-300 resize-none font-mono placeholder:text-ink-tertiary focus:ring-4 focus:ring-brand-secure/10 ${
          error ? 'border-rose-500/50 focus:border-rose-500' : ''
        }`}
        {...props}
      />
      {error && <p className="text-[10px] text-rose-400 mt-1.5">{error}</p>}
    </div>
  );
}
