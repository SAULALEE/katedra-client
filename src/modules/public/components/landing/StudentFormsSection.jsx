import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CircleHelp, X } from 'lucide-react';
import LandingLink from '../../../../app/components/landing/LandingLink';
import { LandingSegmentedToggle, LandingTierCard } from '../../../../app/components/landing/LandingTiers';
import { TIER_GRID_STYLE } from '../../../../app/components/landing/landingStyles';
import { STUDENT_THEME as T } from '../../../../app/components/landing/landingTheme';
import { PRIMARY_CTA, getFormResult } from '../studentLandingJourney.js';
import { FORM_OPTIONS, FORM_QUESTION, FORM_REINFORCEMENT } from './studentLandingContent';

const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-10%' },
  transition: { duration: 0.75, delay, ease: 'easeOut' },
});

// Katedra Forms demo rendered in the Pricing mold: section heading, segmented
// toggle and a light + highlighted dark card.
export default function StudentFormsSection({ navigate }) {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('pregunta');
  const result = mode === 'explicacion' ? getFormResult(selected) : null;

  const choose = (index) => { setSelected(index); setMode('pregunta'); };
  const reset = () => { setSelected(null); setMode('pregunta'); };

  return (
    <section id="katedra-forms" style={{ background: '#ffffff', padding: '120px 24px', scrollMarginTop: '40px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <motion.div {...enter()} style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: T.accent, marginBottom: '16px' }}>Katedra Forms</div>
          <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.05, letterSpacing: '-1.6px', margin: '0 auto', maxWidth: '640px', color: '#0F172A' }}>
            Una evaluación también puede mostrarte cómo avanzar.
          </h2>
        </motion.div>

        <motion.div {...enter(0.08)} style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 60px' }}>
          <LandingSegmentedToggle
            ariaLabel="Vista de la evaluación"
            value={mode}
            onChange={setMode}
            options={[{ value: 'pregunta', label: 'Pregunta' }, { value: 'explicacion', label: 'Explicación' }]}
          />
        </motion.div>

        <div style={TIER_GRID_STYLE}>
          <LandingTierCard index={0}>
            <div style={{ fontWeight: 600, fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>Pregunta 1 de 3</div>
            <div style={{ fontSize: '15px', fontWeight: 500, lineHeight: 1.5, color: '#475569', marginBottom: '28px' }}>{FORM_QUESTION}</div>
            <div role="radiogroup" aria-label="Opciones de respuesta" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              {FORM_OPTIONS.map((option, index) => {
                const active = selected === index;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => choose(index)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', font: 'inherit', fontSize: '14px', fontWeight: 500, color: active ? T.accentStrong : '#334155', border: active ? `1.5px solid ${T.accent}` : '1px solid #E2E8F0', background: active ? T.accentSoft : '#fff', transition: 'all 0.2s' }}
                  >
                    <span style={{ width: '22px', height: '22px', flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 700, background: active ? T.accentSoftStrong : '#F1F5F9', color: active ? T.accentDeep : '#64748B' }}>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={selected === null}
              onClick={() => setMode('explicacion')}
              style={{ fontWeight: 600, fontSize: '15px', color: '#1E293B', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: selected === null ? 'not-allowed' : 'pointer', opacity: selected === null ? 0.55 : 1, transition: 'all 0.2s' }}
            >
              Comprobar respuesta
            </button>
          </LandingTierCard>

          <LandingTierCard dark index={1} badge="VISTA CONCEPTUAL" badgeGradient={T.badgeGradient} badgeShadow={`0 4px 12px rgba(${T.accentRgb},0.3)`}>
            <div aria-live="polite">
              <div style={{ fontWeight: 600, fontSize: '18px', color: '#ffffff', marginBottom: '24px' }}>Explicación</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {result ? (result.correct ? <Check size={34} color={T.accentLight} /> : <X size={34} color="#FDA4AF" />) : <CircleHelp size={34} color="#94A3B8" />}
                <span style={{ fontWeight: 700, fontSize: '40px', letterSpacing: '-2px', color: '#ffffff', lineHeight: 1 }}>
                  {result ? (result.correct ? 'Correcto' : 'Casi') : 'Tu turno'}
                </span>
              </div>
              <p style={{ margin: '0 0 28px', fontSize: '15px', lineHeight: 1.55, color: '#CBD5E1' }}>
                {result
                  ? (result.correct
                    ? 'Si hay menos productores, llega menos energía a los consumidores y sus poblaciones pueden disminuir.'
                    : `La respuesta es la ${String.fromCharCode(65 + result.correctIndex)}: con menos productores llega menos energía a los consumidores.`)
                  : 'Elige una opción y cambia a «Explicación» para ver cómo avanzar. El profesor decide cuándo mostrar resultados.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
              <LandingLink
                to={PRIMARY_CTA.href}
                navigate={navigate}
                style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '15px', color: '#0F172A', padding: '16px', borderRadius: '12px', background: T.tierButtonGradient, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(${T.accentRgb},0.25)`; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {PRIMARY_CTA.label}
              </LandingLink>
              {result && <button type="button" onClick={reset} style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>Repetir</button>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {FORM_REINFORCEMENT.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontWeight: 500, fontSize: '15px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  <Check size={20} color={T.accentLight} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {item}
                </div>
              ))}
            </div>
          </LandingTierCard>
        </div>
      </div>
    </section>
  );
}
