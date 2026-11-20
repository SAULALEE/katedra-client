import { motion } from 'framer-motion';

// Sliding two-option switch used by Pricing (Mensual/Anual) and student Forms.
export function LandingSegmentedToggle({ options, value, onChange, ariaLabel }) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));
  return (
    <div role="group" aria-label={ariaLabel} style={{ position: 'relative', display: 'flex', padding: '6px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
      <div style={{
        position: 'absolute',
        top: '6px',
        bottom: '6px',
        left: activeIndex === 0 ? '6px' : '50%',
        width: 'calc(50% - 6px)',
        borderRadius: '12px',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(15,23,42,0.08)',
        transition: 'left .35s cubic-bezier(.4, 0, .2, 1)'
      }}></div>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            padding: '12px 28px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            transition: 'color .3s',
            color: option.value === value ? '#0F172A' : '#64748B'
          }}
        >
          {option.label}{option.badge}
        </button>
      ))}
    </div>
  );
}

// Light or dark (highlighted) plan-style card.
export function LandingTierCard({ dark = false, index = 0, badge, badgeGradient, badgeShadow, children, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-10%' }}
      transition={{ duration: 0.75, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        position: 'relative',
        padding: '44px 36px',
        borderRadius: '24px',
        border: dark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
        background: dark ? 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' : '#ffffff',
        boxShadow: dark ? '0 32px 64px rgba(15,23,42,0.25)' : '0 12px 32px rgba(15,23,42,0.04)',
        display: 'flex',
        flexDirection: 'column',
        transform: dark ? 'scale(1.04)' : 'scale(1)',
        zIndex: dark ? 2 : 1,
      }}
      {...rest}
    >
      {badge && (
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', padding: '6px 16px', borderRadius: '100px', background: badgeGradient, fontWeight: 700, fontSize: '11px', color: '#fff', letterSpacing: '0.5px', boxShadow: badgeShadow, whiteSpace: 'nowrap' }}>
          {badge}
        </div>
      )}
      {children}
    </motion.div>
  );
}

