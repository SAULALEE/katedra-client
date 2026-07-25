/**
 * Ayudantes puros de presentación del plan. Sin estado y sin llamadas de red, para que
 * puedan usarse desde cualquier componente sin arrastrar el store.
 */

export const PLAN_FREE = 'free';
export const PLAN_PRO = 'pro';

/** Tolera 'PRO' y 'pro': el JWT y el DTO serializan en minúscula, pero la BD guarda el enum. */
export const esPro = (plan) => String(plan || '').toLowerCase() === PLAN_PRO;

export const etiquetaPlan = (plan) => (esPro(plan) ? 'Pro' : 'Gratis');

/**
 * Colores de la insignia, según la convención del panel: ámbar para premium, pizarra
 * para el plan libre.
 */
export const coloresPlan = (plan) => (esPro(plan)
  ? { fondo: 'linear-gradient(120deg,#FBBF24,#D97706)', texto: '#FFFFFF', borde: 'rgba(217,119,6,.35)' }
  : { fondo: 'var(--kt-chip-bg)', texto: 'var(--kt-muted)', borde: 'var(--kt-chip-border)' });

/** Porcentaje consumido, acotado a 0-100 para que la barra nunca se desborde. */
export const porcentajeUso = (usadas, limite) => {
  if (!limite || limite <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((usadas / limite) * 100)));
};

/**
 * Color del medidor. Ámbar a partir del 75% y rojo al agotarse: el objetivo es que el
 * usuario vea que se está quedando sin cuota antes de chocar con el límite, no después.
 */
export const colorUso = (porcentaje) => {
  if (porcentaje >= 100) return '#F43F5E';
  if (porcentaje >= 75) return '#F59E0B';
  return '#10B981';
};

/** Precios de referencia, alineados con las tarjetas de la landing. */
export const PRECIOS = {
  mensual: { monto: 19, sufijo: '/mes', nota: 'Facturado mensualmente' },
  anual: { monto: 15, sufijo: '/mes', nota: 'Facturado $180/año — ahorra $48' }
};
