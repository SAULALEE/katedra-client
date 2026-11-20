import { ArrowRight, BookOpen, ClipboardCheck, Compass, FileText, Layers3 } from 'lucide-react';
import MockWindowBar from '../../../../app/components/landing/MockWindowBar';
import { STUDENT_THEME as T } from '../../../../app/components/landing/landingTheme';

// Same frame as the teacher MockAdminPanel (840x460, 18px radius, window bar),
// showing a student's class view instead of the teacher dashboard.
const colors = { border: 'rgba(15, 23, 42, 0.08)', borderSoft: 'rgba(15, 23, 42, 0.04)', faint: '#94A3B8' };

const sideItem = (active) => ({
  display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px',
  fontSize: '12px', fontWeight: active ? 700 : 600,
  background: active ? T.accentSoft : 'transparent', color: active ? T.accentDeep : '#64748B',
});

const kicker = { display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '8px', color: T.accentDeep, fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' };
const tile = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px', border: '1px solid #EEF1F5', borderRadius: '11px', background: '#fff' };

export default function StudentMockClassPanel() {
  return (
    <div className="kt-mock-panel" role="img" aria-label="Ejemplo de clase de ecosistemas con material, actividad, comentario del profesor y siguiente paso" style={{
      width: '100%', maxWidth: '840px', height: '460px', borderRadius: '18px', border: `1px solid ${colors.border}`,
      background: '#FFFFFF', color: '#475569', boxShadow: '0 24px 50px -28px rgba(15,23,42,0.16)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'Inter', sans-serif", position: 'relative', textAlign: 'left',
    }}>
      <MockWindowBar colors={colors} isDarkMode={false} url="alumnos.katedra.com/clase" />

      <div className="kt-mock-row" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div className="kt-mock-sidebar" style={{ width: '200px', borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '16px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px 12px', borderBottom: `1px solid ${colors.borderSoft}` }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: T.ctaGradient, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '13px' }}>K</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Tu espacio</span>
          </div>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: colors.faint, margin: '14px 4px 6px', textTransform: 'uppercase' }}>Mis clases</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={sideItem(true)}><BookOpen size={15} /> Ecosistemas</span>
            <span style={sideItem(false)}><Layers3 size={15} /> Materiales</span>
            <span style={sideItem(false)}><ClipboardCheck size={15} /> Actividades</span>
          </div>
          <div style={{ marginTop: 'auto', padding: '12px 6px 0', borderTop: `1px solid ${colors.borderSoft}`, color: '#64748B', fontSize: '10px' }}>Una clase. Una ruta clara.</div>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: '18px 22px', background: '#FAFBFC', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '11px', fontWeight: 600 }}>
            <span>Biología / Ecosistemas</span>
            <span style={{ padding: '4px 9px', borderRadius: '100px', background: T.accentSoft, color: T.accentDeep, fontSize: '10px', fontWeight: 700 }}>En curso</span>
          </div>

          <div className="kt-mock-header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', margin: '12px 0 14px' }}>
            <div>
              <div style={{ color: T.accent, fontSize: '9px', fontWeight: 800, letterSpacing: '1px' }}>TEMA ACTUAL</div>
              <div style={{ margin: '4px 0 2px', color: '#0F172A', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>Flujo de energía</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Continúa donde te quedaste.</div>
            </div>
            <span style={{ padding: '7px 10px', borderRadius: '8px', background: '#fff', border: '1px solid #EEF1F5', color: '#0F172A', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>Clase 04</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '6px' }}>
              <strong style={{ color: '#0F172A' }}>Progreso de la clase</strong><span style={{ color: '#64748B' }}>3 de 5 pasos</span>
            </div>
            <div style={{ height: '6px', borderRadius: '999px', background: '#EEF1F5', overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', borderRadius: 'inherit', background: T.ctaGradient }} />
            </div>
          </div>

          <div className="kt-mock-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={tile}>
              <span style={kicker}><FileText size={13} /> MATERIAL RELACIONADO</span>
              <strong style={{ color: '#0F172A', fontSize: '12px' }}>Productores y consumidores</strong>
              <small style={{ marginTop: '3px', color: '#64748B', fontSize: '10px' }}>Lectura · páginas 8–12</small>
            </div>
            <div style={tile}>
              <span style={kicker}><ClipboardCheck size={13} /> ACTIVIDAD PENDIENTE</span>
              <strong style={{ color: '#0F172A', fontSize: '12px' }}>Explica una cadena alimenticia</strong>
              <small style={{ marginTop: '3px', color: '#64748B', fontSize: '10px' }}>Conecta el material con tu respuesta.</small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', margin: '10px 0', padding: '11px 13px', border: '1px solid #EEF1F5', borderLeft: `3px solid ${T.accent}`, borderRadius: '10px', background: '#fff' }}>
            <span style={{ width: '22px', height: '22px', flexShrink: 0, borderRadius: '50%', background: T.accentSoftStrong, color: T.accentDeep, display: 'grid', placeItems: 'center', fontSize: '10px', fontWeight: 800 }}>P</span>
            <div style={{ fontSize: '10.5px', lineHeight: 1.45 }}>
              <div style={{ color: T.accentDeep, fontWeight: 700 }}>Comentario de tu profesor</div>
              <div style={{ color: '#475569' }}>“Vas bien. Explica por qué los productores son el punto de entrada de energía.”</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '10px', background: '#0F172A', color: '#fff' }}>
            <Compass size={17} color={T.accentLight} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#94A3B8', fontSize: '8.5px', fontWeight: 800, letterSpacing: '0.8px' }}>SIGUIENTE PASO RECOMENDADO</div>
              <div style={{ fontSize: '11px', fontWeight: 600 }}>Repasa el esquema y practica con otra cadena alimenticia.</div>
            </div>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
