import { useEffect, useState } from 'react';
import { getPlanesRequest } from '../services/suscripcionService';

export const usePlanes = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    getPlanesRequest()
      .then((data) => {
        if (activo) setPlanes(data);
      })
      .catch((err) => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => { activo = false; };
  }, []);

  return { planes, loading, error };
};

export default usePlanes;
