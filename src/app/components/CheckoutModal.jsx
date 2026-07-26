import { useEffect, useMemo, useRef, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Check, ChevronDown, CreditCard, Info, Lock, Pencil, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSuscripcion } from '../hooks/useSuscripcion';
import { AHORRO_ANUAL, PRECIOS, fechaRenovacion, formatearUSD } from '../utils/plan';
import { FUENTES_STRIPE, construirAppearance } from '../utils/stripeAppearance';

/**
 * Stripe wants ISO country codes, not display names. Kept short on purpose: this is the
 * market Katedra sells to, and a 200-entry list would bury the four options that matter.
 */
const PAISES = [
  { codigo: 'MX', nombre: 'México' },
  { codigo: 'CO', nombre: 'Colombia' },
  { codigo: 'AR', nombre: 'Argentina' },
  { codigo: 'CL', nombre: 'Chile' },
  { codigo: 'PE', nombre: 'Perú' },
  { codigo: 'ES', nombre: 'España' },
  { codigo: 'US', nombre: 'Estados Unidos' }
];

const CAMPOS_OBLIGATORIOS = ['nombreCompleto', 'email', 'pais'];

const DATOS_VACIOS = {
  nombreCompleto: '',
  email: '',
  pais: 'MX',
  ciudad: '',
  direccion: '',
  codigoPostal: ''
};

/**
 * Theme tokens, duplicated here because CheckoutModal is mounted once in App.jsx, outside
 * every page's `[data-root]` — it cannot inherit the panel pages' variables.
 */
const TOKENS = `
  [data-kt-checkout]{
    --kt-bg1:#FFFFFF;
    --kt-text:#334155;--kt-heading:#0F172A;--kt-muted:#64748B;--kt-faint:#94A3B8;
    --kt-border:rgba(15,23,42,.09);--kt-border-soft:rgba(15,23,42,.06);
    --kt-panel-bg:rgba(255,255,255,.85);--kt-panel-border:rgba(15,23,42,.08);
    --kt-chip-bg:rgba(15,23,42,.045);--kt-chip-border:rgba(15,23,42,.08);
    --kt-input-bg:rgba(241,245,249,.7);--kt-input-border:rgba(15,23,42,.12);
    --kt-scrollbar:rgba(15,23,42,.16);
    --kt-shadow-panel:0 14px 30px -18px rgba(15,23,42,.22);
    --kt-modal-bg1:rgba(255,255,255,.98);--kt-modal-bg2:rgba(248,250,252,.98);
    --kt-modal-border:rgba(15,23,42,.09);--kt-modal-backdrop:rgba(15,23,42,.25);
    --kt-shadow-modal:0 30px 70px -25px rgba(15,23,42,.25);
  }
  [data-kt-checkout][data-kt-theme="dark"]{
    --kt-bg1:#0F172A;
    --kt-text:#E2E8F0;--kt-heading:#F8FAFC;--kt-muted:#94A3B8;--kt-faint:#64748B;
    --kt-border:rgba(148,163,184,.1);--kt-border-soft:rgba(148,163,184,.06);
    --kt-panel-bg:rgba(17,24,39,.66);--kt-panel-border:rgba(148,163,184,.12);
    --kt-chip-bg:rgba(148,163,184,.08);--kt-chip-border:rgba(148,163,184,.14);
    --kt-input-bg:rgba(15,23,42,.6);--kt-input-border:rgba(148,163,184,.14);
    --kt-scrollbar:rgba(148,163,184,.22);
    --kt-shadow-panel:0 20px 40px -22px rgba(0,0,0,.7);
    --kt-modal-bg1:rgba(23,31,48,.96);--kt-modal-bg2:rgba(15,23,42,.96);
    --kt-modal-border:rgba(148,163,184,.16);--kt-modal-backdrop:rgba(2,6,23,.6);
    --kt-shadow-modal:0 40px 90px -30px rgba(0,0,0,.8);
  }
  [data-kt-checkout] .kt-co-input{
    width:100%;box-sizing:border-box;height:44px;padding:0 13px;border-radius:10px;
    border:1px solid var(--kt-input-border);background:var(--kt-input-bg);color:var(--kt-text);
    font-family:'Manrope',sans-serif;font-weight:500;font-size:14px;outline:none;
    transition:border-color .2s,box-shadow .2s;
  }
  [data-kt-checkout] .kt-co-input:focus{border-color:#10B981;box-shadow:0 0 0 3px rgba(16,185,129,.15)}
  [data-kt-checkout] .kt-co-input:disabled{opacity:.6;cursor:not-allowed}
  [data-kt-checkout] .kt-co-cta{
    width:100%;height:50px;border:none;border-radius:12px;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:8px;
    font-family:'Manrope',sans-serif;font-weight:800;font-size:14.5px;color:#fff;
    background:linear-gradient(120deg,#10B981,#059669);
    box-shadow:0 12px 28px -12px rgba(16,185,129,.7);
    transition:transform .18s,box-shadow .25s,opacity .2s;
  }
  [data-kt-checkout] .kt-co-cta:hover:not(:disabled){transform:translateY(-2px)}
  [data-kt-checkout] .kt-co-cta:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}
  /* The scrolling element itself carries no border-radius (native scrollbars never clip to
     one); the outer .kt-co-shell clips it instead via overflow:hidden, so the thumb never
     overhangs the card's rounded corners. */
  [data-kt-checkout] .kt-co-scroll{scrollbar-width:thin;scrollbar-color:var(--kt-scrollbar) transparent}
  [data-kt-checkout] .kt-co-scroll::-webkit-scrollbar{width:8px}
  [data-kt-checkout] .kt-co-scroll::-webkit-scrollbar-track{background:transparent}
  [data-kt-checkout] .kt-co-scroll::-webkit-scrollbar-thumb{background:var(--kt-scrollbar);border-radius:100px;border:2px solid transparent;background-clip:content-box}
  @keyframes ktCoRise{0%{opacity:0;transform:translateY(14px) scale(.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes ktCoSpin{to{transform:rotate(360deg)}}
  @keyframes ktCoPulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.35)}50%{box-shadow:0 0 0 10px rgba(16,185,129,0)}}
  @media(max-width:560px){
    [data-kt-checkout] .kt-co-scroll{padding:22px 16px !important}
    [data-kt-checkout] .kt-co-shell{border-radius:16px !important}
    [data-kt-checkout] .kt-co-ciclos{grid-template-columns:1fr !important}
  }
`;

const etiquetaEstilo = {
  display: 'block',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: '12.5px',
  letterSpacing: '-.2px',
  color: 'var(--kt-text)',
  marginBottom: '6px'
};

const tituloSeccion = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: '15.5px',
  letterSpacing: '-.4px',
  color: 'var(--kt-heading)',
  margin: '0 0 16px'
};

const tarjeta = {
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid var(--kt-panel-border)',
  background: 'var(--kt-panel-bg)',
  boxShadow: 'var(--kt-shadow-panel)'
};

/**
 * Country picker matching the app's custom-select convention (button + floating panel with
 * an inset chevron) instead of a native `<select>`, whose browser-rendered popup and
 * edge-flush arrow don't match the rest of the form.
 */
function SelectPais({ value, onChange, disabled, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const seleccionado = PAISES.find((p) => p.codigo === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        style={{
          width: '100%', height: '44px', padding: '0 36px 0 13px', borderRadius: '10px',
          border: `1px solid ${error ? '#F43F5E' : open ? '#10B981' : 'var(--kt-input-border)'}`,
          background: 'var(--kt-input-bg)', color: 'var(--kt-text)',
          fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
          boxShadow: open ? '0 0 0 3px rgba(16,185,129,.15)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .6 : 1,
          transition: 'border-color .2s,box-shadow .2s'
        }}
      >
        {seleccionado?.nombre}
        <ChevronDown size={15} style={{ position: 'absolute', right: '13px', top: '50%', transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)', transition: 'transform .2s', color: 'var(--kt-muted)' }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20,
            maxHeight: '220px', overflowY: 'auto', padding: '6px',
            background: 'var(--kt-panel-bg)', border: '1px solid var(--kt-panel-border)',
            borderRadius: '12px', boxShadow: 'var(--kt-shadow-modal)'
          }}
        >
          {PAISES.map((p) => (
            <div
              key={p.codigo}
              role="option"
              aria-selected={p.codigo === value}
              onClick={() => { onChange(p.codigo); setOpen(false); }}
              style={{
                padding: '9px 11px', borderRadius: '8px', cursor: 'pointer',
                background: p.codigo === value ? 'var(--kt-chip-bg)' : 'transparent',
                color: p.codigo === value ? 'var(--kt-heading)' : 'var(--kt-text)',
                fontFamily: "'Manrope',sans-serif", fontWeight: p.codigo === value ? 700 : 500, fontSize: '13.5px'
              }}
              onMouseEnter={(e) => { if (p.codigo !== value) e.currentTarget.style.background = 'var(--kt-chip-bg)'; }}
              onMouseLeave={(e) => { if (p.codigo !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              {p.nombre}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Fila = ({ etiqueta, sub, valor, destacado }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '13px 0' }}>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: destacado ? 700 : 600, fontSize: '13.5px', color: destacado ? 'var(--kt-heading)' : 'var(--kt-text)' }}>{etiqueta}</div>
      {sub && <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '12.5px', color: 'var(--kt-muted)', marginTop: '2px' }}>{sub}</div>}
    </div>
    <span style={{ flex: 'none', fontFamily: "'Manrope', sans-serif", fontWeight: destacado ? 800 : 600, fontSize: destacado ? '14.5px' : '13.5px', color: destacado ? 'var(--kt-heading)' : 'var(--kt-text)' }}>{valor}</span>
  </div>
);

/** Card step. Lives inside `<Elements>` so it can reach the Stripe hooks. */
function FormularioPago({ aceptaTerminos, onAceptarTerminos, resumen }) {
  const stripe = useStripe();
  const elements = useElements();
  const { confirmarPago, fallarPago, procesando } = useSuscripcion();
  const { actualizarPlan } = useAuth();
  const [listo, setListo] = useState(false);

  const pagar = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const resultado = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (resultado.error) {
      fallarPago(resultado.error.message || 'No pudimos procesar tu pago');
      return;
    }

    // The server re-reads the subscription from Stripe; this call reports no outcome to it.
    const suscripcion = await confirmarPago();
    if (suscripcion) actualizarPlan('pro');
  };

  return (
    <form onSubmit={pagar}>
      <PaymentElement onReady={() => setListo(true)} options={{ layout: 'tabs' }} />

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '20px 0 18px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => onAceptarTerminos(e.target.checked)}
          style={{ flex: 'none', width: '16px', height: '16px', marginTop: '1px', accentColor: '#10B981', cursor: 'pointer' }}
        />
        <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '12.5px', lineHeight: 1.5, color: 'var(--kt-muted)' }}>
          {resumen}
        </span>
      </label>

      <button type="submit" className="kt-co-cta" disabled={!stripe || !listo || !aceptaTerminos || procesando}>
        {procesando ? (
          <>
            <span style={{ width: '15px', height: '15px', border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ktCoSpin .7s linear infinite' }} />
            Procesando…
          </>
        ) : (
          <>
            <Lock size={15} />
            Suscribirse
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Checkout, presented as a single scrolling page rather than a stack of dialogs: the user
 * can see the cycle, the total and the renewal date while typing the card, which is what
 * the reference flow does and what stops the "what am I being charged?" bounce.
 *
 * The billing step and the card step remain two server round-trips (the backend needs the
 * customer before Stripe can hand out a client secret), so the card block reveals in place
 * once the details are accepted instead of pushing a second screen.
 */
export default function CheckoutModal() {
  const {
    paso,
    ciclo,
    facturacion,
    clientSecret,
    publishableKey,
    procesando,
    error,
    cerrarCheckout,
    volverADatos,
    cambiarCiclo,
    enviarDatosFacturacion
  } = useSuscripcion();

  const [datos, setDatos] = useState(facturacion || DATOS_VACIOS);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [faltantes, setFaltantes] = useState([]);
  const cerrarRef = useRef(null);

  const activo = paso !== 'inactivo';

  // Every panel page (Dashboard, Generator, ContentViewer) keeps its OWN light/dark toggle
  // in this same localStorage key rather than the global theme store — see the note in
  // SidebarUserMenu.jsx. CheckoutModal has no page to inherit a prop from (it is mounted
  // once in App.jsx, outside every page), so it reads that same key directly on every
  // render to match whatever the page underneath is actually showing.
  const theme = localStorage.getItem('katedra-theme') || 'light';

  const precio = PRECIOS[ciclo] || PRECIOS.mensual;

  // Captured once per mount of the card step: re-creating the appearance object on a theme
  // toggle remounts the iframe and wipes whatever the user already typed.
  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), [publishableKey]);
  const opcionesElements = useMemo(
    () => (clientSecret ? { clientSecret, appearance: construirAppearance(theme), fonts: FUENTES_STRIPE } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientSecret]
  );

  useEffect(() => {
    if (!activo) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') cerrarCheckout(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activo, cerrarCheckout]);

  if (!activo) return null;

  const actualizar = (event) => {
    const { name, value } = event.target;
    setDatos((actuales) => ({ ...actuales, [name]: value }));
    setFaltantes((actuales) => actuales.filter((campo) => campo !== name));
  };

  const enviarDatos = async (event) => {
    event.preventDefault();
    const vacios = CAMPOS_OBLIGATORIOS.filter((campo) => !String(datos[campo] || '').trim());
    setFaltantes(vacios);
    if (vacios.length) return;
    await enviarDatosFacturacion(datos);
  };

  const bordeCampo = (campo) => (faltantes.includes(campo) ? { borderColor: '#F43F5E' } : undefined);
  const enTarjeta = paso === 'tarjeta';
  const resumenCargo = `Acepto que Katedra cobre a mi método de pago ${formatearUSD(precio.total)} hoy y de forma recurrente cada ${precio.periodo} hasta que cancele. Puedo cancelar cuando quiera desde mi plan.`;

  return (
    <>
      <style>{TOKENS}</style>
      <div
        data-kt-checkout
        data-kt-theme={theme}
        style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      >
        <div
          onClick={cerrarCheckout}
          style={{ position: 'absolute', inset: 0, background: 'var(--kt-modal-backdrop)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        />

        <div
          className="kt-co-shell"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '92vh',
            overflow: 'hidden',
            borderRadius: '20px',
            border: '1px solid var(--kt-modal-border)',
            background: 'linear-gradient(180deg,var(--kt-modal-bg1),var(--kt-modal-bg2))',
            boxShadow: 'var(--kt-shadow-modal)',
            animation: 'ktCoRise .35s cubic-bezier(.16,1,.3,1) both'
          }}
        >
        <div
          className="kt-co-scroll"
          role="dialog"
          aria-modal="true"
          aria-label="Suscripción a Katedra Pro"
          style={{
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '32px',
            fontFamily: "'Manrope', sans-serif",
            color: 'var(--kt-text)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '23px', letterSpacing: '-.8px', color: 'var(--kt-heading)', margin: 0 }}>
              {paso === 'exito' ? 'Katedra Pro' : 'Plan Pro'}
            </h1>
            <button
              ref={cerrarRef}
              type="button"
              onClick={cerrarCheckout}
              aria-label="Cerrar"
              style={{ flex: 'none', width: '34px', height: '34px', display: 'grid', placeItems: 'center', borderRadius: '10px', border: '1px solid var(--kt-chip-border)', background: 'var(--kt-chip-bg)', color: 'var(--kt-muted)', cursor: 'pointer' }}
            >
              <X size={17} />
            </button>
          </div>

          {paso === 'exito' ? (
            <div style={{ ...tarjeta, textAlign: 'center', padding: '44px 30px 34px', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg,#10B981,#34D399)' }} />
              <div style={{ width: '64px', height: '64px', margin: '0 auto 20px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'linear-gradient(140deg,#10B981,#059669)', boxShadow: '0 14px 32px -12px rgba(16,185,129,.55)', animation: 'ktCoPulse 2.4s ease-in-out infinite' }}>
                <Check size={30} color="#fff" strokeWidth={3} />
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-.6px', color: 'var(--kt-heading)', margin: '0 0 8px' }}>
                ¡Ya eres Pro!
              </p>
              <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '13.5px', lineHeight: 1.6, color: 'var(--kt-muted)', margin: '0 auto 26px', maxWidth: '340px' }}>
                Tu suscripción está activa y ya tienes acceso a todo Katedra Pro.
              </p>

              <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: 'var(--kt-chip-bg)', border: '1px solid var(--kt-chip-border)', marginBottom: '26px', textAlign: 'left' }}>
                <ShieldCheck size={18} style={{ flex: 'none', color: '#10B981', marginTop: '1px' }} />
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '12.5px', lineHeight: 1.55, color: 'var(--kt-muted)', margin: 0 }}>
                  Plan Pro · {precio.etiqueta} · {formatearUSD(precio.total)}. Se renueva el {fechaRenovacion(ciclo)}.
                </p>
              </div>

              <button type="button" className="kt-co-cta" onClick={cerrarCheckout}>
                Empezar a usar Pro
              </button>
            </div>
          ) : (
            <>
              {/* Billing period */}
              <div className="kt-co-ciclos" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                {['mensual', 'anual'].map((opcion) => {
                  const p = PRECIOS[opcion];
                  const elegido = ciclo === opcion;
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => cambiarCiclo(opcion)}
                      aria-pressed={elegido}
                      style={{
                        position: 'relative',
                        textAlign: 'left',
                        padding: '15px 16px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        border: `1.5px solid ${elegido ? '#10B981' : 'var(--kt-panel-border)'}`,
                        background: elegido ? 'rgba(16,185,129,.08)' : 'var(--kt-panel-bg)',
                        boxShadow: elegido ? '0 0 0 3px rgba(16,185,129,.12)' : 'none',
                        transition: 'border-color .2s, background .2s, box-shadow .2s'
                      }}
                    >
                      {opcion === 'anual' && (
                        <span style={{ position: 'absolute', top: '13px', right: '13px', padding: '3px 8px', borderRadius: '100px', background: 'linear-gradient(120deg,#10B981,#059669)', color: '#fff', fontFamily: "'Manrope', sans-serif", fontWeight: 700, fontSize: '10.5px' }}>
                          Ahorra {AHORRO_ANUAL}%
                        </span>
                      )}
                      <span style={{ display: 'block', width: '17px', height: '17px', marginBottom: '11px', borderRadius: '50%', border: `2px solid ${elegido ? '#10B981' : 'var(--kt-input-border)'}`, background: elegido ? 'radial-gradient(circle, #10B981 0 42%, transparent 45%)' : 'transparent' }} />
                      <span style={{ display: 'block', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '14.5px', letterSpacing: '-.3px', color: 'var(--kt-heading)' }}>
                        {p.etiqueta}
                      </span>
                      <span style={{ display: 'block', marginTop: '3px', fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '12.5px', color: 'var(--kt-muted)' }}>
                        {formatearUSD(p.total)}/{p.periodo}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Order summary */}
              <div style={{ ...tarjeta, marginBottom: '14px' }}>
                <h2 style={tituloSeccion}>Detalles del pedido</h2>
                <Fila etiqueta="Plan Pro" sub={precio.etiqueta} valor={formatearUSD(precio.total)} />
                <div style={{ height: '1px', background: 'var(--kt-border-soft)' }} />
                <Fila etiqueta="Subtotal" valor={formatearUSD(precio.total)} />
                <div style={{ height: '1px', background: 'var(--kt-border-soft)' }} />
                <Fila etiqueta="Total a pagar hoy" valor={formatearUSD(precio.total)} destacado />
              </div>

              <div style={{ display: 'flex', gap: '11px', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--kt-chip-border)', background: 'var(--kt-chip-bg)', marginBottom: '14px' }}>
                <Info size={16} style={{ flex: 'none', marginTop: '1px', color: 'var(--kt-faint)' }} />
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '12.5px', lineHeight: 1.55, color: 'var(--kt-muted)', margin: 0 }}>
                  Tu suscripción se renovará automáticamente el {fechaRenovacion(ciclo)}. Se te cobrará {formatearUSD(precio.total)} por {precio.periodo}.
                </p>
              </div>

              {error && (
                <div role="alert" style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(244,63,94,.24)', background: 'rgba(244,63,94,.1)', color: '#F43F5E', fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '12.5px', lineHeight: 1.45, marginBottom: '14px' }}>
                  {error}
                </div>
              )}

              {/* Payment method */}
              <div style={tarjeta}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                  <h2 style={{ ...tituloSeccion, margin: 0 }}>Método de pago</h2>
                  {enTarjeta && (
                    <button
                      type="button"
                      onClick={volverADatos}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '9px', border: '1px solid var(--kt-chip-border)', background: 'var(--kt-chip-bg)', color: 'var(--kt-muted)', fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '11.5px', cursor: 'pointer' }}
                    >
                      <Pencil size={12} />
                      Editar datos
                    </button>
                  )}
                </div>

                <form onSubmit={enviarDatos} style={{ display: 'grid', gap: '13px' }}>
                  <div>
                    <label htmlFor="kt-co-nombre" style={etiquetaEstilo}>Nombre completo</label>
                    <input id="kt-co-nombre" className="kt-co-input" style={bordeCampo('nombreCompleto')} name="nombreCompleto" value={datos.nombreCompleto} onChange={actualizar} disabled={enTarjeta} autoComplete="name" />
                  </div>
                  <div>
                    <label htmlFor="kt-co-email" style={etiquetaEstilo}>Correo de facturación</label>
                    <input id="kt-co-email" className="kt-co-input" style={bordeCampo('email')} name="email" type="email" value={datos.email} onChange={actualizar} disabled={enTarjeta} autoComplete="email" />
                  </div>
                  <div>
                    <label style={etiquetaEstilo}>País o región</label>
                    <SelectPais
                      value={datos.pais}
                      onChange={(codigo) => setDatos((actuales) => ({ ...actuales, pais: codigo }))}
                      disabled={enTarjeta}
                      error={faltantes.includes('pais')}
                    />
                  </div>
                  <div>
                    <label htmlFor="kt-co-direccion" style={etiquetaEstilo}>Dirección</label>
                    <input id="kt-co-direccion" className="kt-co-input" name="direccion" value={datos.direccion} onChange={actualizar} disabled={enTarjeta} autoComplete="street-address" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '11px' }}>
                    <div>
                      <label htmlFor="kt-co-ciudad" style={etiquetaEstilo}>Ciudad</label>
                      <input id="kt-co-ciudad" className="kt-co-input" name="ciudad" value={datos.ciudad} onChange={actualizar} disabled={enTarjeta} autoComplete="address-level2" />
                    </div>
                    <div>
                      <label htmlFor="kt-co-cp" style={etiquetaEstilo}>Código postal</label>
                      <input id="kt-co-cp" className="kt-co-input" name="codigoPostal" value={datos.codigoPostal} onChange={actualizar} disabled={enTarjeta} autoComplete="postal-code" />
                    </div>
                  </div>

                  {faltantes.length > 0 && (
                    <p role="alert" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: '12px', color: '#F43F5E', margin: 0 }}>
                      Completa los campos marcados para continuar.
                    </p>
                  )}

                  {!enTarjeta && (
                    <button type="submit" className="kt-co-cta" style={{ marginTop: '5px' }} disabled={procesando}>
                      {procesando ? (
                        <>
                          <span style={{ width: '15px', height: '15px', border: '2.5px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ktCoSpin .7s linear infinite' }} />
                          Preparando pago…
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} />
                          Continuar al pago
                        </>
                      )}
                    </button>
                  )}
                </form>

                {enTarjeta && stripePromise && opcionesElements && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--kt-border-soft)' }}>
                    <Elements stripe={stripePromise} options={opcionesElements}>
                      <FormularioPago
                        aceptaTerminos={aceptaTerminos}
                        onAceptarTerminos={setAceptaTerminos}
                        resumen={resumenCargo}
                      />
                    </Elements>
                  </div>
                )}
              </div>

              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: '11.5px', color: 'var(--kt-faint)', margin: '18px 0 0' }}>
                <Lock size={12} />
                Pago procesado de forma segura por Stripe. Katedra nunca ve tu tarjeta.
              </p>
            </>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
