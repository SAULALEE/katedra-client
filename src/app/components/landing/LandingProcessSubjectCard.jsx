import { motion } from 'framer-motion';
import { Book, Check } from 'lucide-react';

export default function LandingProcessSubjectCard() {
  return (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.1, ease: 'easeOut' }}
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
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #EEF1F5',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Crear Asignatura */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Book size={16} color="#D97706" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontSize: '6px', fontWeight: 700, padding: '3px 5px', borderRadius: '4px', marginBottom: '3px', letterSpacing: '0.5px' }}>NUEVA ASIGNATURA</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>Crear asignatura</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '6.5px', color: '#94A3B8', marginBottom: '4px' }}>NOMBRE DE LA ASIGNATURA *</div>
                    <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '5px 8px', fontSize: '10px', color: '#0F172A', background: '#F8FAFC' }}>Español I</div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '6.5px', color: '#94A3B8', marginBottom: '4px' }}>COLOR DE LA ASIGNATURA</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['#34D399', '#3B82F6', '#F59E0B', '#F43F5E', '#06B6D4', '#8B5CF6'].map((c, i) => (
                        <div key={i} style={{ width: '14px', height: '14px', borderRadius: '4px', background: c, border: c === '#F59E0B' ? '1.5px solid #000' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {c === '#F59E0B' && <Check size={8} color="#fff" strokeWidth={3.5} />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <div style={{ background: '#10B981', color: '#fff', fontSize: '8px', fontWeight: 700, padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16,185,129,0.2)' }}>
                      <Check size={9} strokeWidth={3} color="#fff" /> Crear asignatura
                    </div>
                  </div>
                  <motion.svg
                    initial={{ x: 20, y: 30 }}
                    animate={{ x: [20, -10, 0, 20], y: [30, -5, 5, 30] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', bottom: '15px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>1. Selecciona la materia</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Dinos qué asignatura impartes. Katedra comprende el nivel educativo y adapta automáticamente la profundidad del tema.
              </p>
            </motion.div>
  );
}
