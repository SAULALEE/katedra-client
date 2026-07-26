import { useCallback, useEffect, useState } from 'react';
import { getHistorial } from '../services/temarioService';

/**
 * Read-only content history for the authenticated user. There is deliberately no delete/mutate
 * action here — the history page can only ever refetch, never remove an entry.
 */
export const useHistorial = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistorial = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistorial();
      setEventos(data);
    } catch (err) {
      setError(err.message || 'Error al obtener el historial de contenidos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load only: does not call fetchHistorial() (it synchronously calls
  // setLoading(true), which is already the initial state) to avoid a
  // same-effect cascading re-render. refetch still goes through fetchHistorial.
  useEffect(() => {
    let cancelado = false;
    getHistorial()
      .then((data) => { if (!cancelado) setEventos(data); })
      .catch((err) => { if (!cancelado) setError(err.message || 'Error al obtener el historial de contenidos'); })
      .finally(() => { if (!cancelado) setLoading(false); });
    return () => { cancelado = true; };
  }, []);

  return { eventos, loading, error, refetch: fetchHistorial };
};
