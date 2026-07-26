import React from 'react';
import { Download, ChevronDown, Check, Lock } from 'lucide-react';
import { IconDoc, IconPDF, IconMD, IconPPTX, IconGoogleForms } from './ExportFormatIcons';

/** Icon per export format id, so every menu looks the same across views. */
const ICONO_POR_FORMATO = {
  docx: IconDoc,
  pdf: IconPDF,
  md: IconMD,
  pptx: IconPPTX,
  gs: IconGoogleForms
};

/**
 * Export menu shared by the material view and the generator.
 *
 * @param {object[]} options - [{ id, label, hint?, disabled?, locked? }] — `locked` stays
 *   clickable (unlike `disabled`): onSelect still fires so the caller can open the upgrade prompt.
 * @param {(option) => void} onSelect
 * @param {string|null} loadingOptionId - shows a spinner on that row and blocks further clicks
 * @param {boolean} disabled
 * @param {'chip'|'primary'} variant - chip matches the generator toolbar, primary the material view
 */
export const ExportDropdown = ({
  options = [],
  onSelect,
  loadingOptionId = null,
  disabled = false,
  label = 'Exportar con',
  align = 'right',
  variant = 'chip'
}) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const ocupado = Boolean(loadingOptionId);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const esPrimario = variant === 'primary';

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-busy={ocupado}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: esPrimario ? '9px 15px' : '10px 16px',
          borderRadius: '10px',
          background: esPrimario ? 'rgba(16,185,129,.1)' : 'var(--kt-chip-bg)',
          border: esPrimario ? '1px solid rgba(16,185,129,.3)' : '1px solid var(--kt-chip-border)',
          color: esPrimario ? '#10B981' : 'var(--kt-heading)',
          fontFamily: "'Manrope'", fontWeight: 700, fontSize: '12px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all .2s'
        }}
      >
        {ocupado
          ? <span style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'inline-block' }} />
          : <Download size={14} />}
        {label}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            [align]: 0,
            background: 'var(--kt-panel-bg)', border: '1px solid var(--kt-border)',
            borderRadius: '12px', padding: '6px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(12px)',
            minWidth: '210px', zIndex: 100,
            display: 'flex', flexDirection: 'column', gap: '2px'
          }}
        >
          {options.map((opt) => {
            const Icono = ICONO_POR_FORMATO[opt.id];
            const cargando = loadingOptionId === opt.id;
            // `locked` (plan gate) stays clickable so onSelect can open the upgrade prompt;
            // only `disabled` (no content yet) or a concurrent export blocks the click.
            const bloqueado = opt.disabled || (ocupado && !cargando);

            return (
              <button
                key={opt.id}
                role="menuitem"
                type="button"
                disabled={bloqueado}
                onClick={() => {
                  if (bloqueado) return;
                  setOpen(false);
                  onSelect?.(opt);
                }}
                title={opt.disabled ? 'Genera este material primero' : opt.locked ? 'Exclusivo del plan Pro' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px',
                  background: 'transparent', border: 'none',
                  color: opt.locked && !bloqueado ? 'var(--kt-muted)' : 'var(--kt-text)',
                  fontFamily: "'Manrope'", fontWeight: 600, fontSize: '13px',
                  cursor: bloqueado ? 'not-allowed' : 'pointer',
                  opacity: bloqueado ? 0.45 : 1,
                  textAlign: 'left', transition: 'background .2s'
                }}
                onMouseEnter={(e) => { if (!bloqueado) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ display: 'flex', width: '16px' }}>{Icono ? <Icono /> : <Download size={14} />}</span>
                <span style={{ flex: 1 }}>{opt.label}</span>
                {cargando && (
                  <span style={{ width: '12px', height: '12px', border: '2px solid var(--kt-muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                )}
                {opt.locked && !cargando && <Lock size={12} style={{ color: 'var(--kt-faint)', flex: 'none' }} />}
                {opt.listo && !cargando && !opt.locked && <Check size={13} style={{ color: '#10B981' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
