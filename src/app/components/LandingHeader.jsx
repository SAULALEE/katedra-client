import { useState, useEffect } from 'react';
import LandingLink from './landing/LandingLink';
import { TEACHER_THEME } from './landing/landingTheme';
import { ghostButtonHover, ghostButtonStyle } from './landing/landingStyles';

const TEACHER_LINKS = [
  { label: 'Características', to: '#features' },
  { label: 'Integraciones', to: '#integrations' },
  { label: 'Planes', to: '#pricing' },
  { label: 'FAQs', to: '#faqs' },
];

const TEACHER_ACTIONS = [
  { label: 'Acceder', to: '/login', variant: 'ghost' },
  { label: 'Registrarse', to: '/register', variant: 'primary' },
];

export default function LandingHeader({
  navigate,
  theme = TEACHER_THEME,
  brandTo = '#top',
  brandSuffix,
  links = TEACHER_LINKS,
  crossLink = { label: 'Para alumnos', to: '/alumnos' },
  actions = TEACHER_ACTIONS,
  forceScrolled = false,
  ariaLabel,
  renderExtraActions,
  renderTrailing,
  children,
}) {
  const [scrolledByPage, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrolled = forceScrolled || scrolledByPage;

  return (
      <nav aria-label={ariaLabel} style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(1180px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '11px 14px 11px 20px',
        borderRadius: '16px',
        background: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: scrolled ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: scrolled ? '0 8px 30px rgba(15, 23, 42, 0.10)' : '0 8px 30px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}>
        <LandingLink to={brandTo} navigate={navigate} style={{ display: 'flex', alignItems: 'baseline', gap: '7px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.9px',
            color: scrolled ? '#0F172A' : '#FFFFFF',
            transition: 'color 0.3s ease'
          }}>Katedra</span>
          {brandSuffix && <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            color: scrolled ? theme.accent : 'rgba(255, 255, 255, 0.75)',
            transition: 'color 0.3s ease'
          }}>{brandSuffix}</span>}
        </LandingLink>

        {links.length > 0 && <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(({ label, to }) => (
            <LandingLink
              key={to}
              to={to}
              navigate={navigate}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '14px',
                color: scrolled ? '#475569' : 'rgba(255, 255, 255, 0.75)',
                textDecoration: 'none',
                padding: '8px 13px',
                borderRadius: '8px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = scrolled ? '#F1F5F9' : 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = scrolled ? '#0F172A' : '#FFFFFF';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = scrolled ? '#475569' : 'rgba(255, 255, 255, 0.75)';
              }}
            >
              {label}
            </LandingLink>
          ))}
        </div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {renderExtraActions?.(scrolled)}
          {crossLink && <LandingLink
            className="landing-cross-link"
            to={crossLink.to}
            navigate={navigate}
            style={{ padding: '9px 12px', borderRadius: '9px', background: theme.crossLink.background, border: `1px solid ${theme.crossLink.border}`, color: theme.crossLink.color, fontSize: '13px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >{crossLink.label}</LandingLink>}
          {actions.map(({ label, to, variant, current }) => variant === 'primary' ? (
            <LandingLink
              key={to}
              to={to}
              navigate={navigate}
              aria-current={current ? 'page' : undefined}
              className="landing-header-action"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '14px',
                color: '#fff',
                textDecoration: 'none',
                padding: '10px 17px',
                borderRadius: '9px',
                background: theme.ctaGradient,
                boxShadow: `0 4px 14px ${theme.ctaShadow}`,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
            >
              {label}
            </LandingLink>
          ) : (
            <LandingLink
              key={to}
              to={to}
              navigate={navigate}
              aria-current={current ? 'page' : undefined}
              className="landing-header-action"
              style={ghostButtonStyle(scrolled)}
              {...ghostButtonHover(scrolled)}
            >
              {label}
            </LandingLink>
          ))}
          {renderTrailing?.(scrolled)}
        </div>
        {children}
      </nav>
  );
}
