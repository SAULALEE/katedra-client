import { useState, useEffect } from 'react';

export default function LandingHeader({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'min(1180px, calc(100% - 32px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 14px 11px 20px',
        borderRadius: '16px',
        background: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: scrolled ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: scrolled ? '0 8px 30px rgba(15, 23, 42, 0.10)' : '0 8px 30px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease'
      }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: '18px',
            letterSpacing: '-0.9px',
            color: scrolled ? '#0F172A' : '#FFFFFF',
            transition: 'color 0.3s ease'
          }}>Katedra</span>
        </a>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {['Características', 'Integraciones', 'Planes', 'FAQs'].map((label, i) => {
            const targets = ['#features', '#integrations', '#pricing', '#faqs'];
            return (
              <a
                key={i}
                href={targets[i]}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '14px',
                  color: scrolled ? '#475569' : 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  padding: '8px 13px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
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
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="/login"
            onClick={(e) => { e.preventDefault(); navigate('/login'); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: scrolled ? '#475569' : '#FFFFFF',
              textDecoration: 'none',
              padding: '9px 15px',
              borderRadius: '9px',
              border: scrolled ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.15)',
              background: scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? '#F8FAFC' : 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = scrolled ? '#CBD5E1' : 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? '#fff' : 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = scrolled ? '#E2E8F0' : 'rgba(255, 255, 255, 0.15)';
            }}
          >
            Acceder
          </a>
          <a
            href="/register"
            onClick={(e) => { e.preventDefault(); navigate('/register'); }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 17px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #2B6CB0, #2C5282)',
              boxShadow: '0 4px 14px rgba(43, 108, 176, 0.42)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.filter = 'none'; }}
          >
            Registrarse
          </a>
        </div>
      </nav>
  );
}
