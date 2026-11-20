import { useState } from 'react';
import { FAQ_DATA } from './landingContent';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TEACHER_THEME } from './landingTheme';

export default function LandingFaq({
  theme = TEACHER_THEME,
  id = 'faqs',
  eyebrow = 'Preguntas Frecuentes',
  title = 'Resolvemos tus dudas.',
  items = FAQ_DATA,
}) {
  const [openFaq, setOpenFaq] = useState(0);
  return (
      <section id={id} style={{ background: '#F8FAFC', padding: '110px 24px', scrollMarginTop: '40px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: theme.accent, marginBottom: '16px' }}>{eyebrow}</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-1.4px', margin: 0, color: '#0F172A' }}>
              {title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {items.map((faq, idx) => {
              const isOpen = idx === openFaq;
              return (
                <div key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <button
                    type="button"
                    id={`${id}-q-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '17px', color: isOpen ? theme.accent : '#1E293B', paddingRight: '24px', transition: 'color 0.2s' }}>
                      {faq.q}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isOpen ? `rgba(${theme.accentRgb},0.1)` : '#F1F5F9',
                      color: isOpen ? theme.accent : '#64748B',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}>
                      <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                  </button>
                  <div id={`${id}-a-${idx}`} role="region" aria-labelledby={`${id}-q-${idx}`} aria-hidden={!isOpen} style={{
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    maxHeight: isOpen ? '280px' : '0',
                    opacity: isOpen ? 1 : 0
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: '15.5px', lineHeight: 1.7, color: '#475569', margin: 0, padding: '0 40px 24px 0' }}>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
  );
}
