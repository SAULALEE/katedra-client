
export default function Card({
  children,
  surface = '1',
  hoverable = false,
  className = '',
  onClick,
}) {
  const surfaces = {
    '1': 'bg-surface-1 border-hairline',
    '2': 'bg-surface-2 border-hairline',
    '3': 'bg-surface-3 border-hairline-strong',
    '4': 'bg-surface-4 border-hairline-strong',
  };

  const hoverClasses = hoverable
    ? 'hover:border-brand-primary/50 transition-all duration-200 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-5 sm:p-6 ${surfaces[surface] || surfaces['1']} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
}
