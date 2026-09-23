import { STATS_DATA } from './landingContent';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

export default function LandingStats() {
  return (
      <section style={{ background: '#F9FAFB', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '50px' }}
          >
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.08, letterSpacing: '-1.4px', margin: 0, color: '#0F172A' }}>
              Horas devueltas <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>cada semana</span>.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {STATS_DATA.map((st, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-10%' }}
                transition={{ duration: 0.75, delay: idx * 0.08, ease: 'easeOut' }}
                style={{ textAlign: 'center', padding: '38px 24px', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '16px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
              >
                <div style={{ fontFamily: "'Inter'", fontWeight: 700, fontSize: 'clamp(42px, 6vw, 60px)', letterSpacing: '-2.4px', lineHeight: 1, background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  <AnimatedCounter target={st.target} prefix={st.prefix} suffix={st.suffix} />
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '15px', color: '#475569', marginTop: '14px' }}>{st.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
