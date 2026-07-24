import { useCallback, useState } from 'react';
import { getAsignaturaMeta, setAsignaturaMeta } from '../utils/asignaturaVisual';

/**
 * Client-side visual metadata (color, icon, grado) for asignaturas.
 * The backend does not persist these fields yet, so they live in
 * localStorage until a dedicated migration/endpoint is added.
 */
export const useAsignaturaVisual = () => {
  const [, setVersion] = useState(0);

  const getMeta = useCallback((id) => getAsignaturaMeta(id), []);

  const setMeta = useCallback((id, partial) => {
    const updated = setAsignaturaMeta(id, partial);
    setVersion((v) => v + 1);
    return updated;
  }, []);

  return { getMeta, setMeta };
};
