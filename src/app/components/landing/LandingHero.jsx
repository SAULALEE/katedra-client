import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MockAdminPanel from './MockAdminPanel';

export default function LandingHero({ navigate }) {
  return (
      <header id="top" style={{ position: 'relative', padding: '148px 24px 0', background: 'radial-gradient(125% 140% at 18% 8%, #1E3A8A 0%, #2563EB 22%, #06B6D4 42%, #10B981 66%, #34D399 88%, #FCD34D 116%)', overflow: 'hidden' }}>

        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

        {/* Subtle glow blob */}
        <div style={{ position: 'absolute', width: '380px', height: '380px', left: '-80px', bottom: '-160px', borderRadius: '50%', background: 'radial-gradient(circle, #10B981, transparent 68%)', opacity: 0.5, filter: 'blur(10px)', pointerEvents: 'none' }}></div>

        {/* Grid mesh backdrop overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), 
            radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 20px 20px',
          pointerEvents: 'none'
        }}></div>

        <div style={{ relative: 'zIndex', zIndex: 2, maxWidth: '920px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255, 255, 255, 0.28)', backdropFilter: 'blur(8px)', marginBottom: '26px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', boxShadow: '0 0 8px #34D399' }}></span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.92)', whiteSpace: 'nowrap' }}>
              IA para Educadores
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 'clamp(38px, 6.6vw, 76px)', lineHeight: 1.02, letterSpacing: '-2px', color: '#fff', margin: '0 0 22px', textWrap: 'balance' }}
          >
            Diseña temarios con apoyo de IA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.86)', maxWidth: '620px', margin: '0 auto 36px', textWrap: 'pretty' }}
          >
            Crea Teoría docente, evaluaciones con respuestas y diapositivas para tus clases en <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>menos tiempo</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '13px', justifyContent: 'center' }}
          >
            <a
              href="/register"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '15px 28px',
                borderRadius: '11px',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.28)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.28)'; }}
            >
              Comenzar Gratis
            </a>
            
          </motion.div>
        </div>

        {/* Floating Doc Mockup */}
        <div style={{ zIndex: 2, maxWidth: '840px', margin: '64px auto -120px', paddingBottom: 0, position: 'relative' }}>

          {/* Floating Sticker Doodles */}
          <div className="floating-doodles" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {/* Apple */}
            <div style={{ position: 'absolute', top: '-48px', left: '-68px', transform: 'rotate(-9deg)' }}>
              <div style={{ animation: 'floatY 6s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '56px', height: '56px', borderRadius: '16px', background: '#FEF2F2', border: '1.5px solid #FECACA', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 7.2c-1.4-1.9-4.3-2-5.6-.1C5 9 5.3 12.6 6.9 15c1 1.5 1.9 2.9 3.3 2.9.8 0 1.1-.4 1.8-.4s1 .4 1.8 0.4c1.4 0 2.3-1.4 3.3-2.9 1.6-2.4 1.9-6 .5-7.9-1.3-1.9-4.2-1.8-5.6.1Z" />
                  <path d="M12 7.2c-.2-1.6.5-3 1.9-3.6" stroke="#059669" />
                </svg>
              </div>
            </div>

            {/* Lightbulb */}
            <div style={{ position: 'absolute', top: '-46px', right: '-60px', transform: 'rotate(7deg)' }}>
              <div style={{ animation: 'floatY 7s ease-in-out infinite 0.4s', display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', background: '#FFFBEB', border: '1.5px solid #FDE68A', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 18h5M10.5 21h3" />
                  <path d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.8.9.9 1.6l.1.6h5.2l.1-.6c.1-.7.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
                  <path d="M12 3V1.5M4.6 6 3.5 5M19.4 6l1.1-1" stroke="#FBBF24" />
                </svg>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ position: 'absolute', top: '152px', right: '-74px', transform: 'rotate(8deg)' }}>
              <div style={{ animation: 'floatY2 8s ease-in-out infinite', display: 'grid', placeItems: 'center', width: '52px', height: '52px', borderRadius: '14px', background: '#ECFDF5', border: '1.5px solid #A7F3D0', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="4.5" width="14" height="16.5" rx="2.2" />
                  <path d="M9 4.5V3.5h6v1" />
                  <path d="m8 11 1.1 1.1L11.4 10M8 16l1.1 1.1L11.4 15" />
                  <path d="M14 11h3M14 16h3" />
                </svg>
              </div>
            </div>

            {/* Open Book */}
            <div style={{ position: 'absolute', bottom: '78px', left: '-70px', transform: 'rotate(-7deg)' }}>
              <div style={{ animation: 'floatY 7.5s ease-in-out infinite 0.2s', display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', background: '#F1F5F9', border: '1.5px solid #CBD5E1', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.16)' }}>
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 6.5C10.3 5.2 7.8 4.8 5.5 5.1v11.2c2.3-.3 4.8.1 6.5 1.4 1.7-1.3 4.2-1.7 6.5-1.4V5.1C16.2 4.8 13.7 5.2 12 6.5Z" />
                  <path d="M12 6.5v11.2" />
                </svg>
              </div>
            </div>

            {/* Sparkles */}
            <div style={{ position: 'absolute', top: '20px', left: '120px', color: '#FCD34D', animation: 'pulseGlow 3.5s ease-in-out infinite' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>
            <div style={{ position: 'absolute', bottom: '120px', right: '20px', color: '#fff', animation: 'pulseGlow 4s ease-in-out infinite 0.6s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z" /></svg>
            </div>

            {/* Dribbble SaaS UI elements */}
            {/* Floating badge 1: Top-Left */}
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '-80px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '100px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
              animation: 'floatY 6s ease-in-out infinite',
              pointerEvents: 'auto'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>IA Activa · ✦</span>
            </div>

            {/* Floating badge 2: Top-Right */}
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '-90px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)',
              animation: 'floatY 8s ease-in-out infinite 0.5s',
              textAlign: 'left',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={11} color="#3B82F6" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#3B82F6', letterSpacing: '0.5px' }}>TEMARIOS</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap' }}>Diapositivas listas en PPTX</span>
            </div>

            {/* Floating badge 3: Bottom-Right */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
              right: '-80px',
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '100px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)',
              animation: 'floatY 7s ease-in-out infinite 0.2s',
              pointerEvents: 'auto'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }}></span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#E2E8F0', whiteSpace: 'nowrap' }}>15 Preguntas con respuestas</span>
            </div>
          </div>

          {/* SVG Glow Connections */}
          <svg style={{ position: 'absolute', inset: '-60px -100px', width: 'calc(100% + 200px)', height: 'calc(100% + 120px)', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <linearGradient id="glowGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="glowGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M 60 160 Q 140 180 180 230" fill="none" stroke="url(#glowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 880 160 Q 760 180 660 210" fill="none" stroke="url(#glowGrad2)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 860 440 Q 760 410 680 390" fill="none" stroke="url(#glowGrad1)" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          <MockAdminPanel />

        </div>

        <div style={{ height: '150px' }}></div>
      </header>
  );
}
