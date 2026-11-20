import { useCallback, useEffect, useState } from 'react';
import { getMyStudentProfile } from '../services/studentService.js';

export function useStudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;

    getMyStudentProfile()
      .then((profile) => {
        if (!profile?.id || !profile?.email || !profile?.nombre) {
          throw new Error('Invalid student profile');
        }

        if (active) setStudent(profile);
      })
      .catch(() => {
        if (active) setError('No se pudo validar tu sesión de alumno. Inténtalo de nuevo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRequestVersion((version) => version + 1);
  }, []);

  return { student, loading, error, retry };
}
