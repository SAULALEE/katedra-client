import { Sparkles, FileQuestion } from 'lucide-react';
import LandingProcessCard, { ProcessCursor } from './LandingProcessCard';
import { MINI_MOCK_STYLE } from './landingStyles';

export default function LandingProcessSyllabusCard() {
  return (
    <LandingProcessCard
      delay={0.2}
      glow="rgba(44,82,130,0.12)"
      title="2. Estructura el temario"
      description="Construye una secuencia lógica de módulos. Todo el contenido sigue un orden claro para asegurar la progresión de los estudiantes."
    >
                {/* Mockup UI: Cargar Temario */}
                <div style={MINI_MOCK_STYLE}>
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
                  <ProcessCursor initial={{ x: -20, y: 15 }} animate={{ x: [-20, 10, 0, -20], y: [15, 30, 10, 15] }} duration={5} style={{ bottom: '15px' }} />
                </div>
    </LandingProcessCard>
  );
}
