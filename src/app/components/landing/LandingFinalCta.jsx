import { motion } from 'framer-motion';
import LandingLink from './LandingLink';
import { TEACHER_THEME, NOISE_OVERLAY, HIGHLIGHT_STYLE } from './landingTheme';

export default function LandingFinalCta({
  navigate,
  theme = TEACHER_THEME,
  title = 'Empieza a preparar tu ',
  highlight = 'siguiente temario',
  titleSuffix = '.',
  description = 'Organiza tus contenidos y dedica más tiempo a tus clases.',
  cta = { label: 'Comenzar Gratis', to: '/register' },
}) {
  return (
      <section style={{ background: '#fff', padding: '20px 24px 96px' }}>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', padding: '64px 32px', borderRadius: '26px', textAlign: 'center', overflow: 'hidden', background: theme.bandGradient }}
        >
          {/* Noise overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: NOISE_OVERLAY }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1.04, letterSpacing: '-1.8px', color: '#fff', margin: '0 auto 16px', maxWidth: '620px', textWrap: 'balance' }}>
              {title}<span style={{ ...HIGHLIGHT_STYLE, color: '#ffffff' }}>{highlight}</span>{titleSuffix}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '18px', color: 'rgba(255, 255, 255, 0.86)', margin: '0 auto 30px', maxWidth: '480px' }}>
              {description}
            </p>
            <LandingLink
              to={cta.to}
              navigate={navigate}
              style={{
                display: 'inline-block',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '16px',
                color: '#0F172A',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(15, 23, 42, 0.34)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(15, 23, 42, 0.3)'; }}
            >
              {cta.label}
            </LandingLink>
          </div>
        </motion.div>
      </section>
  );
}
