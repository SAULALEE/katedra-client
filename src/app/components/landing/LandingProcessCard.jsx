import { motion } from 'framer-motion';

// Shared shell for the three "process" cards: lifted card, 240px mock stage,
// soft radial glow, numbered title and description.
export default function LandingProcessCard({ delay = 0.1, glow, title, description, children }) {
  return (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay, ease: 'easeOut' }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #EEF1F5',
                borderRadius: '24px',
                padding: '16px 16px 36px 16px',
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(15, 23, 42, 0.08)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.04)';
                e.currentTarget.style.borderColor = '#EEF1F5';
              }}
            >
              <div style={{
                width: '100%',
                height: '240px',
                background: '#FAFBFC',
                borderRadius: '16px',
                marginBottom: '28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EEF1F5',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`, filter: 'blur(20px)' }}></div>
                {children}
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>{title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                {description}
              </p>
            </motion.div>
  );
}

// Animated pointer drawn over each mini mockup.
export function ProcessCursor({ initial, animate, duration, style }) {
  return (
    <motion.svg
      initial={initial}
      animate={animate}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', right: '15px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10, ...style }}
      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
    >
      <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
    </motion.svg>
  );
}

