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
    borde: 'rgba(15,23,42,.12)'
  },
  dark: {
    fondo: '#111827',
    fondoInput: 'rgba(15,23,42,.75)',
    texto: '#E2E8F0',
    titulo: '#F8FAFC',
    tenue: '#64748B',
    borde: 'rgba(148,163,184,.16)'
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
