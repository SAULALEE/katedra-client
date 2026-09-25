import { motion } from 'framer-motion';
import { Sparkles, FileQuestion } from 'lucide-react';

export default function LandingProcessSyllabusCard() {
  return (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-10%' }}
              transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
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
                <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(44,82,130,0.12) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>

                {/* Mockup UI: Cargar Temario */}
                <div style={{ position: 'relative', width: '85%', background: '#fff', border: '1px solid #EEF1F5', borderRadius: '10px', padding: '14px', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left', zIndex: 2 }}>
                  <div style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', fontSize: '6px', fontWeight: 700, padding: '3px 5px', borderRadius: '4px', marginBottom: '5px', letterSpacing: '0.5px' }}>CREAR TEMARIO</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '12px', color: '#0F172A', marginBottom: '3px' }}>Cargar Temario</div>
                  <div style={{ fontSize: '7px', color: '#64748B', marginBottom: '12px', lineHeight: 1.4 }}>Sube un archivo, ingresa un enlace o define manualmente el temario.</div>

                  <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#64748B', borderRight: '1px solid #E2E8F0' }}>PDF / Archivo</div>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#64748B', borderRight: '1px solid #E2E8F0' }}>Enlace Web</div>
                    <div style={{ flex: 1, padding: '5px 0', fontSize: '7px', textAlign: 'center', color: '#fff', background: '#10B981', fontWeight: 700 }}>Manual</div>
                  </div>

                  <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '5px 6px', fontSize: '6.5px', color: '#065F46', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileQuestion size={10} color="#059669" /> Completa los datos y Katedra organizará el temario.
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '5.5px', color: '#94A3B8', marginBottom: '3px' }}>TÍTULO DEL TEMARIO</div>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '4px 6px', fontSize: '8px', color: '#0F172A' }}>Sujeto y predicado</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '5.5px', color: '#94A3B8', marginBottom: '3px' }}>ASIGNATURA</div>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', padding: '4px 6px', fontSize: '8px', color: '#0F172A' }}>Español I</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <div style={{ background: '#10B981', color: '#fff', fontSize: '8px', fontWeight: 700, padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16,185,129,0.2)' }}>
                      Analizar Temario <Sparkles size={9} strokeWidth={2.5} color="#fff" />
                    </div>
                  </div>

                  <motion.svg
                    initial={{ x: -20, y: 15 }}
                    animate={{ x: [-20, 10, 0, -20], y: [15, 30, 10, 15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: 'absolute', right: '15px', bottom: '15px', width: '24px', height: '24px', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.2))', zIndex: 10 }}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 2.5L21.5 9.5L13.5 13.5L17.5 22.5L12.5 24.5L8.5 15.5L2.5 19.5V2.5Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                  </motion.svg>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '18px', color: '#0F172A', margin: '0 0 10px' }}>2. Estructura el temario</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '14.5px', color: '#475569', margin: 0, padding: '0 20px', lineHeight: 1.6 }}>
                Construye una secuencia lógica de módulos. Todo el contenido sigue un orden claro para asegurar la progresión de los estudiantes.
              </p>
            </motion.div>
  );
}
