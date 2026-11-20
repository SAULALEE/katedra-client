import { INTEGRATIONS_LOOP, CAROUSEL_COLOR } from './landingContent';
import { motion } from 'framer-motion';
import { TEACHER_THEME, NOISE_OVERLAY, HIGHLIGHT_STYLE } from './landingTheme';

export default function LandingIntegrations({
  theme = TEACHER_THEME,
  id = 'integrations',
  eyebrow = 'Llévalo a donde sea',
  title = 'Exporta a las herramientas con las que ',
  highlight = 'ya enseñas',
  titleSuffix = '.',
  items = INTEGRATIONS_LOOP,
}) {
  return (
      <section id={id} style={{
        scrollMarginTop: '40px',
        position: 'relative',
        padding: '88px 0',
        overflow: 'hidden',
        background: theme.bandGradient,
      }}>
        {/* Noise overlay */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.35, backgroundImage: NOISE_OVERLAY }}></div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '46px', padding: '0 24px', zIndex: 1, position: 'relative' }}
        >
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: theme.bandEyebrow, marginBottom: '14px' }}>{eyebrow}</div>
          <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: '0 auto', maxWidth: '620px', color: '#ffffff' }}>
            {title}<span style={{ ...HIGHLIGHT_STYLE, color: '#ffffff' }}>{highlight}</span>{titleSuffix}
          </h2>
        </motion.div>

        {/* Blurred, semi-transparent carousel marquee */}
        <div style={{ position: 'relative', width: '100%', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
          <div style={{ display: 'flex', gap: '48px', width: 'max-content', animation: 'marquee 32s linear infinite', alignItems: 'center' }}>
            {items.map((ig, idx) => (
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
