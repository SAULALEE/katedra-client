import { useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../hooks/useAuth';
import { useSuscripcion } from '../hooks/useSuscripcion';

const campo = { width: '100%', boxSizing: 'border-box', padding: '11px 12px', borderRadius: '9px', border: '1px solid #CBD5E1' };

function FormularioPago() {
  const stripe = useStripe();
  const elements = useElements();
  const { confirmarPago, fallarPago, procesando } = useSuscripcion();
  const { actualizarPlan } = useAuth();

  const pagar = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const resultado = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (resultado.error) {
      fallarPago(resultado.error.message || 'No pudimos procesar tu pago');
      return;
    }
    const suscripcion = await confirmarPago();
    if (suscripcion) actualizarPlan('pro');
  };

  return (
    <form onSubmit={pagar}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || procesando} style={{ ...campo, marginTop: '18px', border: 0, background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
        {procesando ? 'Procesando…' : 'Confirmar pago'}
      </button>
    </form>
  );
}

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
    enviarDatosFacturacion
  } = useSuscripcion();
  const [datos, setDatos] = useState(facturacion || {
    nombreCompleto: '',
    email: '',
    pais: 'MX',
    ciudad: '',
    direccion: '',
    codigoPostal: ''
  });
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  if (paso === 'inactivo') return null;

  const actualizar = (event) => setDatos((actuales) => ({ ...actuales, [event.target.name]: event.target.value }));
  const enviar = async (event) => {
    event.preventDefault();
    await enviarDatosFacturacion(datos);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Checkout" style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'grid', placeItems: 'center', padding: '20px', background: 'rgba(15,23,42,.72)' }}>
      <div style={{ width: 'min(480px, 100%)', maxHeight: '90vh', overflow: 'auto', padding: '26px', borderRadius: '18px', background: '#fff', color: '#0F172A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div><strong>Suscripción Pro</strong><div style={{ color: '#64748B', fontSize: '13px' }}>Facturación {ciclo}</div></div>
          <button type="button" onClick={cerrarCheckout} aria-label="Cerrar" style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: '20px' }}>×</button>
        </div>
        {error && <p role="alert" style={{ color: '#B91C1C' }}>{error}</p>}
        {paso === 'datos' && (
          <form onSubmit={enviar} style={{ display: 'grid', gap: '11px' }}>
            <input style={campo} name="nombreCompleto" value={datos.nombreCompleto} onChange={actualizar} placeholder="Nombre completo" required />
            <input style={campo} name="email" value={datos.email} onChange={actualizar} placeholder="Email" type="email" required />
            <input style={campo} name="pais" value={datos.pais} onChange={actualizar} placeholder="País (MX)" required />
            <input style={campo} name="ciudad" value={datos.ciudad} onChange={actualizar} placeholder="Ciudad" required />
            <input style={campo} name="direccion" value={datos.direccion} onChange={actualizar} placeholder="Dirección" required />
            <input style={campo} name="codigoPostal" value={datos.codigoPostal} onChange={actualizar} placeholder="Código postal" required />
            <button type="submit" disabled={procesando} style={{ ...campo, border: 0, background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {procesando ? 'Preparando…' : 'Continuar al pago'}
            </button>
          </form>
        )}
        {paso === 'tarjeta' && stripePromise && clientSecret && (
          <>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <FormularioPago />
            </Elements>
            <button type="button" onClick={volverADatos} style={{ marginTop: '12px', border: 0, background: 'transparent', color: '#475569', cursor: 'pointer' }}>Volver a datos</button>
          </>
        )}
        {paso === 'exito' && (
          <div>
            <p>Tu suscripción Pro está activa.</p>
            <button type="button" onClick={cerrarCheckout} style={{ ...campo, border: 0, background: '#10B981', color: '#fff', fontWeight: 700 }}>Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
}
