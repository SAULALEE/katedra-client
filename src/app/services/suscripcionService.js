import api from './api';

/**
 * Llamadas al backend de facturación.
 *
 * Sigue la convención del resto de servicios: cada función atrapa el error de axios y
 * relanza un Error con el mensaje del backend, para que los stores no tengan que conocer
 * la forma de la respuesta de axios.
 */

/**
 * Plan, uso del día y capacidades habilitadas.
 *
 * Es la autoridad sobre el plan. El campo `plan` que viene en el usuario de localStorage
 * es sólo una copia para pintar la insignia antes de que esta llamada resuelva.
 */
export const getMiUsoRequest = async () => {
  try {
    const { data } = await api.get('/suscripciones/me/uso');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al consultar tu plan');
  }
};

/** Estado de facturación actual. Devuelve plan FREE si nunca se suscribió. */
export const getMiSuscripcionRequest = async () => {
  try {
    const { data } = await api.get('/suscripciones/me');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al consultar tu suscripción');
  }
};

/**
 * Paso uno del checkout: registra los datos de facturación y devuelve el clientSecret
 * con el que el navegador confirma el pago.
 *
 * Es idempotente en el servidor: repetirlo reutiliza la suscripción en curso en vez de
 * crear otra en Stripe, así que volver atrás en el formulario es seguro.
 */
export const iniciarSuscripcionRequest = async ({ ciclo, facturacion }) => {
  try {
    const { data } = await api.post('/suscripciones', { ciclo, facturacion });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos iniciar el pago');
  }
};

/**
 * Avisa al backend de que el pago se confirmó.
 *
 * No es una afirmación de que se pagó: el servidor sólo la usa para volver a leer el
 * estado real desde Stripe.
 */
export const confirmarSuscripcionRequest = async (suscripcionId) => {
  try {
    const { data } = await api.post(`/suscripciones/${suscripcionId}/confirmar`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos confirmar tu pago');
  }
};

/** Cancela al final del periodo pagado; el plan Pro sigue activo hasta que termine. */
export const cancelarSuscripcionRequest = async () => {
  try {
    const { data } = await api.delete('/suscripciones/me');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No pudimos cancelar tu suscripción');
  }
};
