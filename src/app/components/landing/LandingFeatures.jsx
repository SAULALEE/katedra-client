import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dna, FileText, Check, Monitor } from 'lucide-react';

export default function LandingFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);
  return (
      <section id="features" style={{ background: '#fff', padding: '60px 24px 120px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-10%' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '1.35px', textTransform: 'uppercase', color: '#10B981', marginBottom: '14px' }}>Todo Incluido</div>
            <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(30px, 4.6vw, 50px)', lineHeight: 1.06, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '680px', color: '#0F172A' }}>
              Materiales para preparar <span style={{ fontFamily: "'Manrope', sans-serif", fontStyle: 'italic', fontWeight: 600, color: '#0F172A' }}>cada clase</span>.
            </h2>
          </motion.div>

          <div className="feature-showcase-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'center' }}>

            {/* Sidebar Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Teoría Estructurada', desc: 'Teoría docente organizada por módulos, con referencias editables.' },
                { title: 'Exámenes y Evaluaciones', desc: 'Evaluaciones de opción múltiple y preguntas abiertas, con sus respuestas.' },
                { title: 'Diapositivas Listas', desc: 'Diapositivas organizadas por módulo que puedes exportar a PowerPoint.' }
              ].map((ft, i) => {
                const isActive = activeFeature === i;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveFeature(i)}
                    onClick={() => setActiveFeature(i)}
                    style={{
                      padding: '24px 20px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                      background: isActive ? '#ECFDF5' : 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '18px', color: isActive ? '#065F46' : '#64748B', marginBottom: '6px' }}>{ft.title}</div>
                    <div style={{ fontFamily: "'Inter'", fontWeight: 500, fontSize: '14px', color: isActive ? '#047857' : '#94A3B8', lineHeight: 1.5 }}>{ft.desc}</div>
                  </div>
                )
              })}
            </div>

            {/* Display Screen */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #EEF1F5',
              borderRadius: '24px',
              height: '520px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'inset 0 4px 20px rgba(15,23,42,0.02)'
            }}>
              {/* Fake App Browser Window inside */}
              <div style={{ flex: 1, background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
                {/* Header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981', display: 'grid', placeItems: 'center' }}><Dna size={18} strokeWidth={2.5} /></div>
                  <div>
                    <div style={{ fontSize: '13px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A' }}>Introducción a la web y modelo cliente-servidor.</div>
                    <div style={{ fontSize: '10.5px', fontFamily: "'Inter'", fontWeight: 500, color: '#64748B' }}>Desarrollo Web · Contenido generado con IA</div>
                  </div>
                </div>

                {/* Content Viewer based on active feature */}
                <div style={{ flex: 1, padding: '32px 24px', background: '#FAFBFC', position: 'relative', overflow: 'hidden' }}>
                  {activeFeature === 0 && (
                    // TEORIA MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '24px', maxWidth: '440px', margin: '0 auto', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F8FAFC', color: '#0F172A', display: 'grid', placeItems: 'center' }}><FileText size={15} strokeWidth={2.5} /></div>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Material Teórico</div>
                              <div style={{ fontSize: '9px', color: '#64748B' }}>Lectura de ~4 min</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '9px', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '4px 8px', borderRadius: '4px' }}>Exportar ↓</div>
                        </div>
                        <div style={{ height: '2px', width: '100%', background: '#2B6CB0', borderRadius: '1px', marginBottom: '16px' }}></div>
                        <div style={{ fontSize: '14px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>INTRODUCCIÓN</div>
                        <div style={{ height: '6px', width: '100%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '92%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '96%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '24px' }}></div>
                        <div style={{ fontSize: '14px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>Evolución de la Web</div>
                        <div style={{ height: '6px', width: '100%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                        <div style={{ height: '6px', width: '85%', background: '#F1F5F9', borderRadius: '3px', marginBottom: '8px' }}></div>
                      </div>
                    </motion.div>
                  )}
                  {activeFeature === 1 && (
                    // EVALUACION MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ECFDF5', display: 'grid', placeItems: 'center', color: '#10B981' }}><Check size={16} strokeWidth={3} /></div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Banco de Preguntas</div>
                            <div style={{ fontSize: '9px', color: '#64748B' }}>Cuestionario interactivo</div>
                          </div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ display: 'inline-block', padding: '4px 8px', borderRadius: '12px', background: '#EFF6FF', color: '#3B82F6', fontSize: '9px', fontFamily: "'Inter'", fontWeight: 700, marginBottom: '12px', letterSpacing: '0.5px' }}>PREGUNTA #1</div>
                          <div style={{ fontSize: '15px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>¿Cuál característica define la Web 1.0?</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F1F5F9', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#64748B' }}>A</div>
                              <div style={{ height: '6px', width: '50%', background: '#E2E8F0', borderRadius: '3px' }}></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1.5px solid #10B981', background: '#ECFDF5', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#D1FAE5', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#047857' }}>B</div>
                              <div style={{ height: '6px', width: '65%', background: '#10B981', borderRadius: '3px' }}></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F1F5F9', display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 700, color: '#64748B' }}>C</div>
                              <div style={{ height: '6px', width: '40%', background: '#E2E8F0', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeFeature === 2 && (
                    // DIAPOSITIVAS MOCKUP
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                      <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', width: '100%', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#EFF6FF', display: 'grid', placeItems: 'center', color: '#3B82F6' }}><Monitor size={15} strokeWidth={2.5} /></div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Presentación Visual</div>
                            <div style={{ fontSize: '9px', color: '#64748B' }}>Visor de láminas autogeneradas (16:9)</div>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '220px', background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 16px 40px rgba(15,23,42,0.08)', marginBottom: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ width: '40px', height: '4px', background: '#10B981', marginBottom: '16px' }}></div>
                          <div style={{ fontSize: '10px', fontFamily: "'Inter'", fontWeight: 700, color: '#10B981', letterSpacing: '1px', marginBottom: '12px' }}>DESARROLLO WEB</div>
                          <div style={{ fontSize: '22px', fontFamily: "'Inter'", fontWeight: 700, color: '#0F172A', lineHeight: 1.1, marginBottom: '12px' }}>Introducción a la web y modelo cliente-servidor.</div>
                          <div style={{ fontSize: '12px', fontFamily: "'Inter'", fontWeight: 500, color: '#64748B' }}>Introducción a la web y modelo cliente-servidor</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #10B981', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                          <div style={{ flex: 1, height: '40px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '6px' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
  );
}
