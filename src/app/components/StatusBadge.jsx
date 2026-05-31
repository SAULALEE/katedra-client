import React from 'react';

export default function StatusBadge({
  children,
  pulseColor = 'bg-emerald-500',
  className = '',
}) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-hairline text-ink-muted text-[11px] sm:text-xs select-none ${className}`}>
      {pulseColor && (
        <span className={`w-1.5 h-1.5 rounded-full ${pulseColor} animate-pulse shrink-0`}></span>
      )}
      <span className="font-sans font-medium">{children}</span>
    </div>
  );
}
