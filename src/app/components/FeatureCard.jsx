
export default function FeatureCard({
  title,
  description,
  icon,
  className = '',
}) {
  return (
    <div className={`bg-surface-1 border border-hairline hover:border-brand-primary/50 rounded-lg p-6 space-y-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200 text-left ${className}`}>
      {icon && (
        <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-indigo-400 select-none">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold tracking-card-title text-ink font-sans">
        {title}
      </h3>
      <p className="text-ink-muted text-xs leading-relaxed tracking-body font-sans">
        {description}
      </p>
    </div>
  );
}
