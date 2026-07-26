/**
 * Single source of truth for which formats each material piece can be exported to.
 * Mirrors FormatoExportacion on the backend; keep both in sync.
 */

/**
 * Tab ids are not backend piece names: the material view calls the slides tab "slides".
 * Every place that turns a tab into an API parameter goes through this map.
 */
export const PIEZA_POR_TAB = {
  teoria: 'teoria',
  evaluacion: 'evaluacion',
  slides: 'diapositivas',
  diapositivas: 'diapositivas'
};

export const EXTENSION_POR_FORMATO = {
  docx: 'docx',
  pdf: 'pdf',
  md: 'md',
  pptx: 'pptx',
  gs: 'gs'
};

export const OPCIONES_EXPORTACION = {
  teoria: [
    { id: 'docx', label: 'Documento Word' },
    { id: 'pdf', label: 'Documento PDF' },
    { id: 'md', label: 'Markdown' }
  ],
  evaluacion: [
    { id: 'docx', label: 'Documento Word' },
    { id: 'pdf', label: 'Documento PDF' },
    { id: 'md', label: 'Markdown' },
    { id: 'gs', label: 'Google Forms' }
  ],
  diapositivas: [
    { id: 'pptx', label: 'Presentación PPTX' },
    { id: 'pdf', label: 'Documento PDF' }
  ]
};

/** Formats gated behind PlanUsuario#permiteExportacionAvanzada on the backend. */
const FORMATOS_AVANZADOS = new Set(['md', 'gs']);

/**
 * Options for a piece, optionally disabled when the piece has no generated content — the user
 * should never be able to trigger a download that can only come back as a 404 — and optionally
 * locked when the plan does not include Markdown/Google Forms exports. `locked` stays clickable
 * (unlike `disabled`): clicking it is what opens the upgrade prompt.
 *
 * @param {string} pieza backend piece name
 * @param {{ disponible?: boolean, puedeExportarAvanzado?: boolean }} [opciones]
 */
export const opcionesDePieza = (pieza, { disponible = true, puedeExportarAvanzado = true } = {}) =>
  (OPCIONES_EXPORTACION[pieza] || []).map(opcion => ({
    ...opcion,
    disabled: !disponible,
    locked: FORMATOS_AVANZADOS.has(opcion.id) && !puedeExportarAvanzado
  }));
