import { ClipboardCheck, Compass, FileText, Sparkles } from 'lucide-react';
import LandingProcessCard, { ProcessCursor } from '../../../../app/components/landing/LandingProcessCard';
import { MINI_MOCK_STYLE } from '../../../../app/components/landing/landingStyles';
import { STUDENT_THEME as T } from '../../../../app/components/landing/landingTheme';
import { DEMO_STEPS } from '../studentLandingJourney.js';

const [consigna, material, , feedback, siguiente] = DEMO_STEPS;

const pill = { display: 'inline-block', background: T.accentSoftStrong, color: T.accentStrong, fontSize: '6px', fontWeight: 700, padding: '3px 5px', borderRadius: '4px', marginBottom: '5px', letterSpacing: '0.5px' };
const line = (width) => ({ height: '5px', width, background: '#F1F5F9', borderRadius: '3px', marginBottom: '5px' });
const action = { background: T.accent, color: '#fff', fontSize: '8px', fontWeight: 700, padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: `0 2px 8px rgba(${T.accentRgb},0.2)` };

function ConsignaCard() {
  return (
    <LandingProcessCard delay={0.1} glow={`rgba(${T.accentRgb},0.12)`} title="1. Entiende la consigna" description={consigna.detail}>
      <div style={MINI_MOCK_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: T.accentSoft, display: 'grid', placeItems: 'center' }}><ClipboardCheck size={16} color={T.accent} /></div>
          <div>
            <div style={pill}>{consigna.status.toUpperCase()}</div>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A' }}>Explica una cadena alimenticia</div>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: '6.5px', color: '#94A3B8', marginBottom: '4px' }}>CONSIGNA</div>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '6px 8px', fontSize: '8px', lineHeight: 1.45, color: '#0F172A', background: '#F8FAFC', marginBottom: '10px' }}>{consigna.body}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={action}>{consigna.cue} <Sparkles size={9} strokeWidth={2.5} color="#fff" /></div>
        </div>
        <ProcessCursor initial={{ x: 20, y: 30 }} animate={{ x: [20, -10, 0, 20], y: [30, -5, 5, 30] }} duration={4.5} style={{ bottom: '15px' }} />
      </div>
    </LandingProcessCard>
  );
}

function MaterialCard() {
  return (
    <LandingProcessCard delay={0.2} glow="rgba(91,33,182,0.12)" title="2. Revisa el material" description={material.detail}>
      <div style={MINI_MOCK_STYLE}>
        <div style={pill}>{material.status.toUpperCase()}</div>
        <div style={{ fontWeight: 700, fontSize: '12px', color: '#0F172A', marginBottom: '3px' }}>Flujo de energía</div>
        <div style={{ fontSize: '7px', color: '#64748B', marginBottom: '10px' }}>Lectura · páginas 8–12</div>
        {[['8', 'Productores', false], ['10', 'Esquema: productores y consumidores', true], ['12', 'Cadenas alimenticias', false]].map(([page, label, active]) => (
          <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', marginBottom: '5px', border: `1px solid ${active ? T.accentBorder : '#EEF1F5'}`, borderRadius: '7px', background: active ? T.accentSoft : '#FCFCFD' }}>
            <FileText size={10} color={active ? T.accent : '#94A3B8'} />
            <span style={{ flex: 1, fontSize: '7.5px', fontWeight: active ? 700 : 600, color: active ? T.accentStrong : '#475569' }}>{label}</span>
            <span style={{ fontSize: '6.5px', color: '#94A3B8' }}>p. {page}</span>
          </div>
        ))}
        <ProcessCursor initial={{ x: -20, y: 15 }} animate={{ x: [-20, 10, 0, -20], y: [15, 30, 10, 15] }} duration={5} style={{ bottom: '15px' }} />
      </div>
    </LandingProcessCard>
  );
}

function NextStepCard() {
  return (
    <LandingProcessCard delay={0.3} glow="rgba(167,139,250,0.16)" title="3. Da el siguiente paso" description={siguiente.detail}>
      <div style={MINI_MOCK_STYLE}>
        <div style={{ display: 'flex', gap: '8px', padding: '8px', border: '1px solid #EEF1F5', borderLeft: `2px solid ${T.accent}`, borderRadius: '8px', background: '#FCFCFD', marginBottom: '8px' }}>
          <div style={{ width: '16px', height: '16px', flexShrink: 0, borderRadius: '50%', background: T.accentSoftStrong, fontSize: '8px', fontWeight: 700, color: T.accentDeep, display: 'grid', placeItems: 'center' }}>P</div>
          <div>
            <div style={{ fontSize: '7px', fontWeight: 700, color: T.accentDeep, marginBottom: '2px' }}>{feedback.status}</div>
            <div style={{ fontSize: '7px', color: '#475569', lineHeight: 1.4 }}>{feedback.body}</div>
          </div>
        </div>
        <div style={line('100%')} />
        <div style={{ ...line('70%'), marginBottom: '10px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', background: '#0F172A' }}>
          <Compass size={12} color={T.accentLight} />
          <div>
            <div style={{ fontSize: '5.5px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>SIGUIENTE PASO</div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>{siguiente.body}</div>
          </div>
        </div>
        <ProcessCursor initial={{ x: 20, y: -10 }} animate={{ x: [20, 0, 15, 20], y: [-10, 20, 5, -10] }} duration={4.2} style={{ top: '25px' }} />
      </div>
    </LandingProcessCard>
  );
}

export default function StudentProcessCards() {
  return (
    <>
      <ConsignaCard />
      <MaterialCard />
      <NextStepCard />
    </>
  );
}
