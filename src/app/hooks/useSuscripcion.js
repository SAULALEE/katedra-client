import { useEffect } from 'react';
import { useSuscripcionStore } from '../store/suscripcionStore';
import { esPro } from '../utils/plan';

/**
 * Binds the billing store and exposes already-derived permissions.
 *
 * Components ask `puedeGenerarDiapositivas`, never `plan === 'pro'`. If the free tier ever
 * included slides, only the backend changes: the flags come from /suscripciones/me/uso and
 * are not recomputed here.
 *
 * @param {boolean} cargarAlMontar - fetch usage on mount. Enable it at one point per screen
 *   (the sidebar) so every consumer does not fire the same request.
 */
export const useSuscripcion = (cargarAlMontar = false) => {
  const store = useSuscripcionStore();

  useEffect(() => {
    if (cargarAlMontar && !store.uso && !store.loading) {
      store.cargarUso();
    }
    // Mount only: including the whole store would fire the request on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargarAlMontar]);

  const uso = store.uso;

  return {
    ...store,

    plan: uso?.plan ?? null,
    esPro: esPro(uso?.plan),

    // Capability flags exactly as the backend sends them. Before usage loads, assume the
    // most restrictive: showing one lock too many for 200ms beats offering a feature the
    // server will answer with a 403.
    puedeUsarModeloPro: uso?.permiteModeloPro ?? false,
    puedeGenerarDiapositivas: uso?.permiteDiapositivas ?? false,
    puedeCargarArchivo: uso?.permiteCargaArchivo ?? false,
    puedeCargarUrl: uso?.permiteCargaUrl ?? false,
    puedeExportarAvanzado: uso?.permiteExportacionAvanzada ?? false,

    generacionesUsadas: uso?.generacionesUsadas ?? 0,
    generacionesLimite: uso?.generacionesLimite ?? 0,
    generacionesRestantes: Math.max(0, (uso?.generacionesLimite ?? 0) - (uso?.generacionesUsadas ?? 0)),
    exportacionesUsadas: uso?.exportacionesUsadas ?? 0,
    exportacionesLimite: uso?.exportacionesLimite ?? 0
  };
};

export default useSuscripcion;
