import { motion } from 'framer-motion';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { STUDENT_THEME as T } from '../../../../app/components/landing/landingTheme';
import { AI_HELP } from '../studentLandingJourney.js';

const card = { background: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(15,23,42,0.03)' };

// Panel content for the feature showcase: question → contextual answer → action.
export default function StudentAiPanel({ activeFeature }) {
  const help = AI_HELP[activeFeature] ?? AI_HELP[0];
  return (
    <motion.div key={activeFeature} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} aria-live="polite">
      <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '12px 16px', borderRadius: '14px 14px 4px 14px', background: T.accentSoft, border: `1px solid ${T.accentBorder}`, color: T.accentStrong, fontSize: '13px', fontWeight: 600 }}>
          {help.prompt}
        </div>

        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: T.accentSoft, color: T.accent, display: 'grid', placeItems: 'center' }}><Sparkles size={15} strokeWidth={2.5} /></div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>Katedra IA</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>{help.title}</div>
            </div>
          </div>
          <div style={{ height: '2px', width: '100%', background: T.accent, borderRadius: '1px', marginBottom: '16px' }}></div>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>{help.answer}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '18px', padding: '6px 10px', borderRadius: '6px', background: T.accentSoft, color: T.accentDeep, fontSize: '11px', fontWeight: 700 }}>
            {help.action} <ArrowRight size={12} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px', color: '#64748B', fontSize: '11px', fontWeight: 500 }}>
          <LockKeyhole size={13} /> IA para comprender, no para copiar. Tus respuestas siguen siendo tuyas.
        </div>
      </div>
    </motion.div>
  );
}
