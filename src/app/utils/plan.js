/**
 * Pure presentation helpers for the plan. Stateless and network-free, so any component can
 * use them without pulling in the store.
 */

export const PLAN_FREE = 'free';
export const PLAN_PRO = 'pro';

/** Tolerates 'PRO' and 'pro': the JWT and DTO serialize lowercase, the DB stores the enum. */
export const esPro = (plan) => String(plan || '').toLowerCase() === PLAN_PRO;

export const etiquetaPlan = (plan) => (esPro(plan) ? 'Pro' : 'Gratis');

/** Badge colours, per the panel convention: amber for premium, slate for the free tier. */
export const coloresPlan = (plan) => (esPro(plan)
  ? { fondo: 'linear-gradient(120deg,#FBBF24,#D97706)', texto: '#FFFFFF', borde: 'rgba(217,119,6,.35)' }
  : { fondo: 'var(--kt-chip-bg)', texto: 'var(--kt-muted)', borde: 'var(--kt-chip-border)' });

/** Consumed percentage, clamped to 0-100 so the bar can never overflow. */
export const porcentajeUso = (usadas, limite) => {
  if (!limite || limite <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((usadas / limite) * 100)));
};

/**
 * Meter colour. Amber from 75% and red once exhausted: the point is that the user sees the
 * quota running out before they hit the wall, not after.
 */
export const colorUso = (porcentaje) => {
  if (porcentaje >= 100) return '#F43F5E';
  if (porcentaje >= 75) return '#F59E0B';
  return '#10B981';
};

/**
 * Reference prices, aligned with the landing page cards.
 *
 * `monto` is the headline figure (per month, so both cycles compare on the same axis);
 * `total` is what the card is actually charged on each renewal, which is the only number
 * the checkout may show next to "Total a pagar hoy".
 */
export const PRECIOS = {
  mensual: { monto: 19, total: 19, sufijo: '/mes', periodo: 'mes', etiqueta: 'Mensual', nota: 'Facturado mensualmente' },
  anual: { monto: 15, total: 180, sufijo: '/mes', periodo: 'año', etiqueta: 'Anual', nota: 'Facturado $180/año — ahorra $48' }
};

/** Discount of the annual cycle against paying twelve months, for the "save" badge. */
export const AHORRO_ANUAL = Math.round((1 - PRECIOS.anual.total / (PRECIOS.mensual.total * 12)) * 100);

/** USD with two decimals, as the invoice will read it. */
export const formatearUSD = (monto) => `USD ${monto.toFixed(2)}`;

/** Next charge date for the chosen cycle, counted from today. */
export const fechaRenovacion = (ciclo) => {
  const fecha = new Date();
  if (ciclo === 'anual') fecha.setFullYear(fecha.getFullYear() + 1);
  else fecha.setMonth(fecha.getMonth() + 1);
  return fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
};
