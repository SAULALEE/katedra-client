/**
 * Formats a relative "time ago" label. Pure by design: `now` must be supplied by the
 * caller (e.g. `useState(Date.now)`) rather than read via `Date.now()` internally, since
 * calling that impure function during render breaks React's purity rules.
 */
export const formatTimeAgo = (ts, now) => {
  const s = Math.floor((now - ts) / 1000);
  if (s < 10) return 'justo ahora';
  if (s < 60) return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
};
