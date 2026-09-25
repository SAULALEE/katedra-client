import { motion } from 'framer-motion';

export default function LandingProcessMaterialCard() {
  return (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
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
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Material Generado */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', borderBottom: '2px solid #0F172A', paddingBottom: '7px', marginBottom: '-8.5px' }}>1. Módulos</span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: '#94A3B8' }}>2. Teoría</span>
                    <span style={{ fontSize: '8px', fontWeight: 600, color: '#94A3B8' }}>3. Diapositivas</span>
                  </div>

                  <div style={{ fontSize: '6px', fontWeight: 700, color: '#10B981', letterSpacing: '0.5px', marginBottom: '3px' }}>TEMARIO DEL CURSO</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>Español I</div>

                  <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #EEF1F5', borderRadius: '8px', background: '#FCFCFD', marginBottom: '8px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = '#FCFCFD'}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F1F5F9', fontSize: '8px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Sujeto y predicado</div>
                      <div style={{ fontSize: '6.5px', color: '#64748B', lineHeight: 1.4 }}>Núcleo y complementos en la oración.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #EEF1F5', borderRadius: '8px', background: '#FCFCFD', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = '#FCFCFD'}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#F1F5F9', fontSize: '8px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>Tipos de oraciones</div>
                      <div style={{ fontSize: '6.5px', color: '#64748B', lineHeight: 1.4 }}>Simples y compuestas. Nexos coordinantes.</div>
                    </div>
                  </div>

                  <motion.svg
                    initial={{ x: 20, y: -10 }}
                    animate={{ x: [20, 0, 15, 20], y: [-10, 20, 5, -10] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', top: '25px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>3. Obtén tu clase</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Recibe teoría sustentada, evaluaciones con sus respuestas y diapositivas listas para presentar en el aula.
              </p>
            </motion.div>
  );
}
