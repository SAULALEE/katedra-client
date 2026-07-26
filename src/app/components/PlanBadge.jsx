import { Sparkles } from 'lucide-react';
import { coloresPlan, esPro, etiquetaPlan } from '../utils/plan';

/**
 * Plan pill. Amber for Pro, slate for Gratis, following the panel colour convention (amber
 * premium, sky admin, emerald/slate free).
 *
 * Replaces the "Premium" pill Users.jsx derived from the role, which lied: the role has
 * never meant anything about billing.
 */
export const PlanBadge = ({ plan, size = 'md' }) => {
  // Renders nothing when the plan is unknown rather than falling back to "Gratis".
  // The fallback was actively wrong: if the usage call fails or is still in flight, a Pro
  // subscriber would be shown a badge claiming they are on the free tier.
  if (!plan) return null;

  const colores = coloresPlan(plan);
  const pro = esPro(plan);
  const compacto = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compacto ? '4px' : '5px',
        padding: compacto ? '2px 8px' : '3px 10px',
        borderRadius: '100px',
        background: colores.fondo,
        border: `1px solid ${colores.borde}`,
        color: colores.texto,
        fontFamily: "'Manrope'",
        fontWeight: 700,
        fontSize: compacto ? '10px' : '11px',
        letterSpacing: '.2px',
        whiteSpace: 'nowrap'
      }}
    >
      {pro && <Sparkles size={compacto ? 10 : 11} style={{ flex: 'none' }} />}
      {etiquetaPlan(plan)}
    </span>
  );
};

export default PlanBadge;
