import { useEffect } from 'react';
import { useAsignaturaStore } from '../store/asignaturaStore';

export const useAsignaturas = () => {
  const {
    asignaturas,
    loading,
    error,
    fetchAsignaturas,
    crearAsignatura,
    eliminarAsignatura
  } = useAsignaturaStore();

  useEffect(() => {
    fetchAsignaturas();
  }, [fetchAsignaturas]);

  return { asignaturas, loading, error, fetchAsignaturas, crearAsignatura, eliminarAsignatura };
};
