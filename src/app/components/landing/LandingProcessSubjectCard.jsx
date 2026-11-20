import { Book, Check } from 'lucide-react';
import LandingProcessCard, { ProcessCursor } from './LandingProcessCard';
import { MINI_MOCK_STYLE } from './landingStyles';

export default function LandingProcessSubjectCard() {
  return (
    <LandingProcessCard
      delay={0.1}
      glow="rgba(16,185,129,0.12)"
      title="1. Selecciona la materia"
      description="Dinos qué asignatura impartes. Katedra comprende el nivel educativo y adapta automáticamente la profundidad del tema."
    >
                {/* Mockup UI: Crear Asignatura */}
                <div style={MINI_MOCK_STYLE}>
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
                  <ProcessCursor initial={{ x: 20, y: 30 }} animate={{ x: [20, -10, 0, 20], y: [30, -5, 5, 30] }} duration={4.5} style={{ bottom: '15px' }} />
                </div>
    </LandingProcessCard>
  );
}
