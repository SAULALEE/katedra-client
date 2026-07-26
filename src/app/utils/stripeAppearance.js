/**
 * Appearance object for Stripe Elements.
 *
 * Elements render inside a cross-origin iframe, so they cannot read the `--kt-*` custom
 * properties the rest of the panel uses. The token values are therefore mirrored here as
 * literals; keep them in sync with the THEME TOKENS block the pages declare.
 */

const PALETA = {
  light: {
    fondo: '#FFFFFF',
    fondoInput: '#F1F5F9',
    texto: '#334155',
    titulo: '#0F172A',
    tenue: '#94A3B8',
    // Solid approximation of the app's own --kt-input-border (rgba(15,23,42,.12) over
    // white): Stripe rejects alpha channels, so the subtlety has to come from the literal
    // shade instead, or the field reads as a much harsher border than every other input.
    borde: '#E2E5EA'
  },
  dark: {
    fondo: '#111827',
    fondoInput: '#0F172A',
    texto: '#E2E8F0',
    titulo: '#F8FAFC',
    tenue: '#64748B',
    // Same approximation for --kt-input-border in dark mode (rgba(148,163,184,.14) over
    // the panel's dark background).
    borde: '#2A3446'
  }
};

/** @param {'light'|'dark'} theme */
export const construirAppearance = (theme) => {
  const c = PALETA[theme === 'dark' ? 'dark' : 'light'];

  return {
    theme: theme === 'dark' ? 'night' : 'flat',
    variables: {
      colorPrimary: '#10B981',
      colorBackground: c.fondoInput,
      colorText: c.texto,
      colorTextSecondary: c.tenue,
      colorTextPlaceholder: c.tenue,
      colorDanger: '#F43F5E',
      fontFamily: "'Manrope', sans-serif",
      fontSizeBase: '14px',
      borderRadius: '10px',
      spacingUnit: '4px'
    },
    rules: {
      '.Input': {
        border: `1px solid ${c.borde}`,
        boxShadow: 'none',
        padding: '11px 12px'
      },
      '.Input:focus': {
        border: '1px solid #10B981',
        boxShadow: '0 0 0 3px rgba(16,185,129,.15)'
      },
      '.Label': {
        fontWeight: '600',
        fontSize: '12.5px',
        color: c.texto,
        marginBottom: '6px'
      },
      '.Tab': {
        border: `1px solid ${c.borde}`,
        boxShadow: 'none'
      },
      '.Tab--selected': {
        border: '1px solid #10B981',
        boxShadow: '0 0 0 3px rgba(16,185,129,.15)'
      }
    }
  };
};

/** Manrope must be loaded inside the iframe too, or Elements fall back to system fonts. */
export const FUENTES_STRIPE = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap' }
];

export default construirAppearance;
