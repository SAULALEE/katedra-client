import { useEffect } from 'react';
import { useSuscripcionStore } from '../store/suscripcionStore';
import { esPro } from '../utils/plan';

/**
 * Enlaza el store de facturación y expone los permisos ya derivados.
 *
 * Los componentes preguntan `puedeGenerarDiapositivas`, no `plan === 'pro'`. Así, si
 * mañana el plan Gratis incluyera diapositivas, sólo cambia el backend: las banderas
 * llegan de `/suscripciones/me/uso` y no se recalculan aquí.
 *
 * @param {boolean} cargarAlMontar - pedir el uso al montar. Actívalo sólo en un punto por
 *   pantalla (el sidebar) para no disparar la misma petición desde cada consumidor.
 */
export const useSuscripcion = (cargarAlMontar = false) => {
  const store = useSuscripcionStore();

  useEffect(() => {
    if (cargarAlMontar && !store.uso && !store.loading) {
      store.cargarUso();
    }
    // Sólo al montar: incluir el store completo dispararía la petición en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargarAlMontar]);

  const uso = store.uso;

  return {
    ...store,

    plan: uso?.plan ?? null,
    esPro: esPro(uso?.plan),

    // Banderas de capacidad, tal cual las manda el backend. Cuando el uso aún no cargó se
    // asume lo más restrictivo: es preferible mostrar un candado de más durante 200 ms que
    // ofrecer una función que el servidor va a rechazar con un 403.
    puedeUsarModeloPro: uso?.permiteModeloPro ?? false,
    puedeGenerarDiapositivas: uso?.permiteDiapositivas ?? false,
    puedeCargarArchivo: uso?.permiteCargaArchivo ?? false,
    puedeCargarUrl: uso?.permiteCargaUrl ?? false,

    generacionesUsadas: uso?.generacionesUsadas ?? 0,
    generacionesLimite: uso?.generacionesLimite ?? 0,
    generacionesRestantes: Math.max(0, (uso?.generacionesLimite ?? 0) - (uso?.generacionesUsadas ?? 0)),
    exportacionesUsadas: uso?.exportacionesUsadas ?? 0,
    exportacionesLimite: uso?.exportacionesLimite ?? 0
  };
};

export default useSuscripcion;
