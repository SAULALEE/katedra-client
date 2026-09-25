import { INTEGRATIONS_LOOP, CAROUSEL_COLOR } from './landingContent';
import { motion } from 'framer-motion';

export default function LandingIntegrations() {
  return (
      <section id="integrations" style={{
        position: 'relative',
        padding: '88px 0',
        overflow: 'hidden',
        background: 'linear-gradient(110deg, #1D4ED8 0%, #0EA5E9 30%, #10B981 65%, #34D399 100%)',
      }}>
        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.35, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '46px', padding: '0 24px', relative: 'zIndex', zIndex: 1, position: 'relative' }}
        >
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#A7F3D0', marginBottom: '14px' }}>Llévalo a donde sea</div>
          <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: '0 auto', maxWidth: '620px', color: '#ffffff' }}>
            Exporta a las herramientas con las que <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>ya enseñas</span>.
          </h2>
        </motion.div>

        {/* Blurred, semi-transparent carousel marquee */}
        <div style={{ position: 'relative', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
          <div style={{ display: 'flex', gap: '48px', width: 'max-content', animation: 'marquee 32s linear infinite', alignItems: 'center' }}>
            {INTEGRATIONS_LOOP.map((ig, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  opacity: 0.8,
                  transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{
                  display: 'grid',
                  placeItems: 'center',
                  color: CAROUSEL_COLOR,
                }}>
                  {ig.icon(CAROUSEL_COLOR)}
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: '18px',
                  color: CAROUSEL_COLOR,
                  letterSpacing: '-0.3px',
                }}>
                  {ig.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}
