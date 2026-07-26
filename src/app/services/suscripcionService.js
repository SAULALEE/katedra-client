import api from './api.js';

/**
 * Billing backend calls.
 *
 * Follows the convention of the other services: each function catches the axios error and
 * rethrows an Error carrying the backend message, so stores never need to know the shape
 * of an axios response.
 */

/** Public plan catalog. Prices and currency are resolved by the backend from Stripe. */
export const getPlanesRequest = async () => {
  try {
    const { data } = await api.get('/suscripciones/planes');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos consultar los planes', { cause: error });
  }
};

/**
 * Plan, today's usage and enabled capabilities.
 *
 * The authority on the plan. The `plan` field on the localStorage user is only a copy, used
 * to paint the badge before this call resolves.
 */
export const getMiUsoRequest = async () => {
  try {
    const { data } = await api.get('/suscripciones/me/uso');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al consultar tu plan', { cause: error });
  }
};

/** Current billing state. Reports plan FREE for a user who never subscribed. */
export const getMiSuscripcionRequest = async () => {
  try {
    const { data } = await api.get('/suscripciones/me');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al consultar tu suscripción', { cause: error });
  }
};

/**
 * Checkout step one: registers billing details and returns the clientSecret the browser
 * confirms the payment with.
 *
 * Idempotent server-side: repeating it reuses the in-flight subscription instead of
 * creating another one in Stripe, so going back in the form is safe.
 */
export const iniciarSuscripcionRequest = async ({ ciclo, facturacion }) => {
  try {
    const { data } = await api.post('/suscripciones', { ciclo, facturacion });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos iniciar el pago', { cause: error });
  }
};

/**
 * Tells the backend the payment was confirmed.
 *
 * Not a claim that anything was paid: the server only uses it to decide which subscription
 * to re-read from Stripe.
 */
export const confirmarSuscripcionRequest = async (suscripcionId) => {
  try {
    const { data } = await api.post(`/suscripciones/${suscripcionId}/confirmar`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos confirmar tu pago', { cause: error });
  }
};

/** Cancels at the end of the paid period; Pro stays active until it runs out. */
export const cancelarSuscripcionRequest = async () => {
  try {
    const { data } = await api.delete('/suscripciones/me');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos cancelar tu suscripción', { cause: error });
  }
};
