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

  useEffect(() => {
    fetchHistorial();
  }, [fetchHistorial]);

  return { eventos, loading, error, refetch: fetchHistorial };
};
