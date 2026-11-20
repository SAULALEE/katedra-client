import LandingProcessCard, { ProcessCursor } from './LandingProcessCard';
import { MINI_MOCK_STYLE } from './landingStyles';

export default function LandingProcessMaterialCard() {
  return (
    <LandingProcessCard
      delay={0.3}
      glow="rgba(245,158,11,0.12)"
      title="3. Obtén tu clase"
      description="Recibe teoría sustentada, evaluaciones con sus respuestas y diapositivas listas para presentar en el aula."
    >
                {/* Mockup UI: Material Generado */}
                <div style={MINI_MOCK_STYLE}>
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
                  <ProcessCursor initial={{ x: 20, y: -10 }} animate={{ x: [20, 0, 15, 20], y: [-10, 20, 5, -10] }} duration={4.2} style={{ top: '25px' }} />
                </div>
    </LandingProcessCard>
  );
}
