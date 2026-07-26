import { create } from 'zustand';
import {
  cancelarSuscripcionRequest,
  confirmarSuscripcionRequest,
  getMiSuscripcionRequest,
  getMiUsoRequest,
  iniciarSuscripcionRequest
} from '../services/suscripcionService';

/**
 * Billing state and the checkout step machine.
 *
 *   inactivo ──open──► datos ──POST /suscripciones ok──► tarjeta ──payment ok──► exito
 *                        ▲                                  │
 *                        └──────────── back ────────────────┘
 *
 * The tarjeta -> datos -> tarjeta loop is safe because the backend reuses the in-flight
 * INCOMPLETA subscription: resubmitting the form does not create another Stripe
 * subscription. Deliberately not solved with a flag here, since client state drifts.
 */
export const useSuscripcionStore = create((set, get) => ({
  suscripcion: null,
  uso: null,
  loading: false,
  error: null,

  paso: 'inactivo',
  clientSecret: null,
  publishableKey: null,
  suscripcionId: null,
  ciclo: 'mensual',
  facturacion: null,
  procesando: false,

  /** Loads today's usage. The authoritative source for the plan. */
  cargarUso: async () => {
    set({ loading: true, error: null });
    try {
      const uso = await getMiUsoRequest();
      set({ uso, loading: false });
      return uso;
    } catch (err) {
      set({ error: err.message, loading: false });
      return null;
    }
  },

  cargarSuscripcion: async () => {
    try {
      const suscripcion = await getMiSuscripcionRequest();
      set({ suscripcion });
      return suscripcion;
    } catch (err) {
      set({ error: err.message });
      return null;
    }
  },

  abrirCheckout: (ciclo = 'mensual') => set({
    paso: 'datos',
    ciclo,
    error: null,
    // Clear the previous secret: if the user switches billing period, the old secret
    // belongs to a different subscription and mounting it would charge the wrong amount.
    clientSecret: null,
    suscripcionId: null
  }),

  cerrarCheckout: () => set({
    paso: 'inactivo',
    clientSecret: null,
    suscripcionId: null,
    facturacion: null,
    procesando: false,
    error: null
  }),

  volverADatos: () => set({ paso: 'datos', error: null }),

  cambiarCiclo: (ciclo) => set({ ciclo, clientSecret: null, suscripcionId: null }),

  /** Step 1 -> 2. Keeps the details so the form can be repopulated if the user goes back. */
  enviarDatosFacturacion: async (facturacion) => {
    set({ procesando: true, error: null, facturacion });
    try {
      const { ciclo } = get();
      const datos = await iniciarSuscripcionRequest({ ciclo, facturacion });
      set({
        clientSecret: datos.clientSecret,
        publishableKey: datos.publishableKey,
        suscripcionId: datos.suscripcionId,
        paso: 'tarjeta',
        procesando: false
      });
      return true;
    } catch (err) {
      set({ error: err.message, procesando: false });
      return false;
    }
  },

  /** Step 2 -> success. The backend revalidates against Stripe; this reports no outcome to it. */
  confirmarPago: async () => {
    const { suscripcionId } = get();
    if (!suscripcionId) return null;

    set({ procesando: true, error: null });
    try {
      const suscripcion = await confirmarSuscripcionRequest(suscripcionId);
      set({ suscripcion, paso: 'exito', procesando: false });
      await get().cargarUso();
      return suscripcion;
    } catch (err) {
      set({ error: err.message, procesando: false });
      return null;
    }
  },

  /** Stripe's own error (declined card, failed 3DS). Retryable. */
  fallarPago: (mensaje) => set({ error: mensaje, procesando: false, paso: 'tarjeta' }),

  cancelar: async () => {
    set({ procesando: true, error: null });
    try {
      const suscripcion = await cancelarSuscripcionRequest();
      set({ suscripcion, procesando: false });
      await get().cargarUso();
      return suscripcion;
    } catch (err) {
      set({ error: err.message, procesando: false });
      return null;
    }
  },

  limpiarError: () => set({ error: null })
}));

export default useSuscripcionStore;
