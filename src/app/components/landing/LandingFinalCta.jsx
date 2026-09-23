import { motion } from 'framer-motion';

export default function LandingFinalCta({ navigate }) {
  return (
      <section style={{ background: '#fff', padding: '20px 24px 96px' }}>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-10%' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ position: 'relative', maxWidth: '1080px', margin: '0 auto', padding: '64px 32px', borderRadius: '26px', textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(110deg, #1D4ED8 0%, #0EA5E9 30%, #10B981 65%, #34D399 100%)' }}
        >
          {/* Noise overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.45, backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n2'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n2)'/></svg>")` }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 5vw, 52px)', lineHeight: 1.04, letterSpacing: '-1.8px', color: '#fff', margin: '0 auto 16px', maxWidth: '620px', textWrap: 'balance' }}>
              Empieza a preparar tu <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#ffffff' }}>siguiente temario</span>.
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '18px', color: 'rgba(255, 255, 255, 0.86)', margin: '0 auto 30px', maxWidth: '480px' }}>
              Organiza tus contenidos y dedica más tiempo a tus clases.
            </p>
            <a
              href="/register"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
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
              Comenzar Gratis
            </a>
          </div>
        </motion.div>
      </section>
  );
}
