import React from 'react';
import { Check, Lock, X, Zap } from 'lucide-react';
import { PlanBadge } from './PlanBadge';
import { useSuscripcion } from '../hooks/useSuscripcion';
import { PRECIOS, colorUso, esPro, porcentajeUso } from '../utils/plan';

const CAPACIDADES = [
  { clave: 'generaciones', etiqueta: 'Generaciones de IA al día', free: '10', pro: '100' },
  { clave: 'modelo', etiqueta: 'Modelo Catedrático', free: false, pro: true },
  { clave: 'diapositivas', etiqueta: 'Generar diapositivas', free: false, pro: true },
  { clave: 'archivo', etiqueta: 'Crear temario desde PDF', free: false, pro: true },
  { clave: 'url', etiqueta: 'Crear temario desde enlace web', free: false, pro: true },
  { clave: 'exportaciones', etiqueta: 'Exportaciones al día', free: '5', pro: '100' }
];

const Celda = ({ valor }) => {
  if (valor === true) return <Check size={15} color="#10B981" />;
  if (valor === false) return <Lock size={13} color="var(--kt-faint)" />;
  return <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '12.5px', color: 'var(--kt-text)' }}>{valor}</span>;
};

const Medidor = ({ etiqueta, usadas, limite }) => {
  const pct = porcentajeUso(usadas, limite);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '11.5px', color: 'var(--kt-muted)' }}>{etiqueta}</span>
        <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11.5px', color: 'var(--kt-text)' }}>{usadas}/{limite}</span>
      </div>
      <div style={{ height: '6px', borderRadius: '100px', background: 'var(--kt-chip-bg)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '100px', background: colorUso(pct), transition: 'width .3s ease' }} />
      </div>
    </div>
  );
};

/**
 * Plan comparison and the entry point to checkout.
 *
 * Follows the panel's modal convention (blurred backdrop, 20px radius, spring transition)
 * rather than introducing a dialog primitive: the repo has no Dialog component and its
 * Tailwind build is unreliable for arbitrary spacing utilities, which is why the panel
 * pages use inline styles throughout.
 *
 * Adds what the existing modals lack: Escape to close, a focus trap, and aria-modal.
 */
export const PlanModal = ({ abierto, onCerrar, onMejorar }) => {
  const { uso, esPro: yaEsPro, suscripcion, cargarSuscripcion, cancelar, procesando } = useSuscripcion();
  const [ciclo, setCiclo] = React.useState('mensual');
  const [confirmandoCancelacion, setConfirmandoCancelacion] = React.useState(false);
  const panelRef = React.useRef(null);
  const cerrarRef = React.useRef(null);

  React.useEffect(() => {
    if (abierto && yaEsPro) cargarSuscripcion();
    if (!abierto) setConfirmandoCancelacion(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, yaEsPro]);

  // Escape closes, Tab is trapped inside the panel. The panel pages' own modals do
  // neither, so keyboard users could tab into the page behind the backdrop.
  React.useEffect(() => {
    if (!abierto) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onCerrar();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    cerrarRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const precio = PRECIOS[ciclo];

  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'grid', placeItems: 'center', padding: '24px', background: 'var(--kt-modal-backdrop)', backdropFilter: 'blur(8px)' }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Tu plan"
        style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', border: '1px solid var(--kt-modal-border)', background: 'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2)), var(--kt-bg1)', boxShadow: 'var(--kt-shadow-modal)', padding: '28px' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '4px' }}>
              <h2 style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '21px', letterSpacing: '-.6px', color: 'var(--kt-heading)', margin: 0 }}>
                Tu plan
              </h2>
              <PlanBadge plan={uso?.plan} />
            </div>
            <p style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '13px', color: 'var(--kt-muted)', margin: 0 }}>
              {yaEsPro ? 'Tienes acceso a todas las funciones.' : 'Mejora a Pro para desbloquear todo Katedra.'}
            </p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            style={{ flex: 'none', width: '32px', height: '32px', display: 'grid', placeItems: 'center', borderRadius: '10px', border: '1px solid var(--kt-chip-border)', background: 'var(--kt-chip-bg)', color: 'var(--kt-muted)', cursor: 'pointer' }}
          >
            <X size={17} />
          </button>
        </div>

        {uso && (
          <div style={{ display: 'flex', gap: '18px', padding: '14px 16px', borderRadius: '14px', background: 'var(--kt-chip-bg)', border: '1px solid var(--kt-chip-border)', marginBottom: '20px' }}>
            <Medidor etiqueta="Generaciones hoy" usadas={uso.generacionesUsadas} limite={uso.generacionesLimite} />
            <Medidor etiqueta="Exportaciones hoy" usadas={uso.exportacionesUsadas} limite={uso.exportacionesLimite} />
          </div>
        )}

        <div style={{ borderRadius: '14px', border: '1px solid var(--kt-border)', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 74px 74px', alignItems: 'center', padding: '10px 14px', background: 'var(--kt-chip-bg)', borderBottom: '1px solid var(--kt-border)' }}>
            <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: 'var(--kt-faint)', letterSpacing: '.4px' }}>FUNCIÓN</span>
            <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: 'var(--kt-muted)', textAlign: 'center' }}>GRATIS</span>
            <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: '#D97706', textAlign: 'center' }}>PRO</span>
          </div>
          {CAPACIDADES.map((c, i) => (
            <div
              key={c.clave}
              style={{ display: 'grid', gridTemplateColumns: '1fr 74px 74px', alignItems: 'center', padding: '11px 14px', borderTop: i === 0 ? 'none' : '1px solid var(--kt-border-soft)' }}
            >
              <span style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '12.5px', color: 'var(--kt-text)' }}>{c.etiqueta}</span>
              <span style={{ display: 'grid', placeItems: 'center' }}><Celda valor={c.free} /></span>
              <span style={{ display: 'grid', placeItems: 'center' }}><Celda valor={c.pro} /></span>
            </div>
          ))}
        </div>

        {yaEsPro ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {suscripcion?.periodoFin && (
              <p style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '12.5px', color: 'var(--kt-muted)', margin: 0 }}>
                {suscripcion.cancelaAlFinal
                  ? `Tu plan Pro termina el ${new Date(suscripcion.periodoFin).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}.`
                  : `Se renueva el ${new Date(suscripcion.periodoFin).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}.`}
              </p>
            )}
            {!suscripcion?.cancelaAlFinal && (
              confirmandoCancelacion ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={async () => { await cancelar(); setConfirmandoCancelacion(false); }}
                    disabled={procesando}
                    style={{ flex: 1, padding: '11px', borderRadius: '11px', border: '1px solid rgba(244,63,94,.28)', background: 'rgba(244,63,94,.1)', color: '#FB7185', fontFamily: "'Manrope'", fontWeight: 700, fontSize: '13px', cursor: procesando ? 'wait' : 'pointer' }}
                  >
                    {procesando ? 'Cancelando…' : 'Sí, cancelar al final del periodo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmandoCancelacion(false)}
                    style={{ padding: '11px 16px', borderRadius: '11px', border: '1px solid var(--kt-chip-border)', background: 'var(--kt-chip-bg)', color: 'var(--kt-text)', fontFamily: "'Manrope'", fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Volver
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmandoCancelacion(true)}
                  style={{ padding: '11px', borderRadius: '11px', border: '1px solid var(--kt-chip-border)', background: 'transparent', color: 'var(--kt-muted)', fontFamily: "'Manrope'", fontWeight: 600, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancelar suscripción
                </button>
              )
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '8px', padding: '4px', borderRadius: '12px', background: 'var(--kt-chip-bg)', border: '1px solid var(--kt-chip-border)', marginBottom: '16px' }}>
              {['mensual', 'anual'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCiclo(c)}
                  style={{ flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontFamily: "'Manrope'", fontWeight: 700, fontSize: '12.5px', transition: 'background .2s, color .2s', background: ciclo === c ? 'linear-gradient(120deg,#10B981,#059669)' : 'transparent', color: ciclo === c ? '#fff' : 'var(--kt-muted)' }}
                >
                  {c === 'mensual' ? 'Mensual' : 'Anual −20%'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Inter'", fontWeight: 600, fontSize: '32px', letterSpacing: '-1.4px', color: 'var(--kt-heading)' }}>
                ${precio.monto}
              </span>
              <span style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '13px', color: 'var(--kt-muted)' }}>{precio.sufijo}</span>
            </div>
            <p style={{ fontFamily: "'Manrope'", fontWeight: 500, fontSize: '12px', color: 'var(--kt-faint)', margin: '0 0 16px' }}>{precio.nota}</p>

            <button
              type="button"
              onClick={() => onMejorar(ciclo)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(120deg,#FBBF24,#D97706)', color: '#fff', fontFamily: "'Manrope'", fontWeight: 700, fontSize: '13.5px', letterSpacing: '.2px', cursor: 'pointer', boxShadow: '0 10px 30px -8px rgba(217,119,6,.5)' }}
            >
              <Zap size={16} />
              Mejorar a Pro
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlanModal;
