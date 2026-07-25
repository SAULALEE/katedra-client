import { create } from 'zustand';
import {
  cancelarSuscripcionRequest,
  confirmarSuscripcionRequest,
  getMiSuscripcionRequest,
  getMiUsoRequest,
  iniciarSuscripcionRequest
} from '../services/suscripcionService';

/**
 * Estado de facturación y máquina de pasos del checkout.
 *
 *   inactivo ──abrir──► datos ──POST /suscripciones ok──► tarjeta ──pago ok──► exito
 *                         ▲                                  │
 *                         └──────────── volver ──────────────┘
 *
 * El bucle tarjeta → datos → tarjeta es seguro porque el backend reutiliza la suscripción
 * INCOMPLETA en curso: reenviar el formulario no crea otra suscripción en Stripe. No se
 * intenta resolver con una bandera aquí, porque el estado del cliente se desincroniza.
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

  /** Carga el uso del día. Es la fuente autorizada del plan. */
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
    // Se limpia el secreto anterior: si el usuario cambia de ciclo, el secreto viejo
    // pertenece a otra suscripción y montarlo cobraría el importe equivocado.
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

  /** Paso 1 → 2. Guarda los datos para repoblar el formulario si el usuario vuelve. */
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

  /** Paso 2 → éxito. El backend revalida contra Stripe; esto no le comunica un resultado. */
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

  /** Error del propio Stripe (tarjeta rechazada, 3DS fallido). Reintentable. */
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
