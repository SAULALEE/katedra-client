import React from 'react';
import { CreditCard, LogOut, Zap } from 'lucide-react';
import { PlanBadge } from './PlanBadge';
import { colorUso, esPro, porcentajeUso } from '../utils/plan';

const filaEstilo = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '9px 10px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: "'Manrope'",
  fontWeight: 600,
  fontSize: '13px',
  color: 'var(--kt-text)'
};

/**
 * Daily consumption meter. Always shown, including on Pro: knowing how much you have used
 * is useful information, not just a sales lever.
 */
const MedidorUso = ({ etiqueta, usadas, limite }) => {
  const pct = porcentajeUso(usadas, limite);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '11px', color: 'var(--kt-muted)' }}>
          {etiqueta}
        </span>
        <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '11px', color: 'var(--kt-text)' }}>
          {usadas}/{limite}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={usadas}
        aria-valuemin={0}
        aria-valuemax={limite}
        aria-label={etiqueta}
        style={{ height: '5px', borderRadius: '100px', background: 'var(--kt-chip-bg)', overflow: 'hidden' }}
      >
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: '100px', background: colorUso(pct), transition: 'width .3s ease' }} />
      </div>
    </div>
  );
};

/**
 * Contents of the gear popover: current plan, today's consumption and shortcuts.
 *
 * Lives inside SidebarUserMenu, which already handles opening, Escape and outside clicks.
 * This component only paints.
 */
export const AjustesPopover = ({ uso, cargando, onAbrirPlan, onLogout }) => {
  const plan = uso?.plan;
  const pro = esPro(plan);

  return (
    <>
      <div style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ fontFamily: "'Manrope'", fontWeight: 700, fontSize: '12px', color: 'var(--kt-muted)', letterSpacing: '.3px' }}>
            TU PLAN
          </span>
          {/* Three distinct states, never collapsed into one: loading, unknown (the call
              failed) and known. Showing "Gratis" for either of the first two would tell a
              Pro subscriber they are on the free tier. */}
          {!uso
            ? <span style={{ fontFamily: "'Manrope'", fontWeight: 600, fontSize: '11px', color: 'var(--kt-faint)' }}>
                {cargando ? '…' : 'No disponible'}
              </span>
            : <PlanBadge plan={plan} size="sm" />}
        </div>

        {uso && (
          <>
            <MedidorUso etiqueta="Generaciones hoy" usadas={uso.generacionesUsadas} limite={uso.generacionesLimite} />
            <MedidorUso etiqueta="Exportaciones hoy" usadas={uso.exportacionesUsadas} limite={uso.exportacionesLimite} />
          </>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--kt-border)', margin: '2px 0' }} />

      <button
        type="button"
        role="menuitem"
        onClick={onAbrirPlan}
        style={{
          ...filaEstilo,
          // Free sees a sales CTA; Pro sees a neutral link to its own billing.
          background: pro ? 'transparent' : 'linear-gradient(120deg,rgba(251,191,36,.14),rgba(217,119,6,.06))',
          borderColor: pro ? 'transparent' : 'rgba(217,119,6,.28)',
          color: pro ? 'var(--kt-text)' : 'var(--kt-heading)'
        }}
      >
        {pro
          ? <CreditCard size={16} style={{ flex: 'none', color: 'var(--kt-muted)' }} />
          : <Zap size={16} style={{ flex: 'none', color: '#D97706' }} />}
        <span>{pro ? 'Gestionar mi plan' : 'Mejorar a Pro'}</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={onLogout}
        style={{ ...filaEstilo, color: '#FB7185' }}
      >
        <LogOut size={16} style={{ flex: 'none' }} />
        <span>Cerrar sesión</span>
      </button>
    </>
  );
};

export default AjustesPopover;
