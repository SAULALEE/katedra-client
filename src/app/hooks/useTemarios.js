import { useEffect } from 'react';
import { useTemarioStore } from '../store/temarioStore';

/**
 * Custom Hook to interface with global temarios (courses) Zustand store.
 * Fully compliant with the application core architecture guidelines.
 */
export const useTemarios = () => {
  const {
    courses,
    loading,
    error,
    fetchCourses,
    crearTemario,
    cargarTemario
  } = useTemarioStore();

  // Load courses on component mount if empty
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetchCourses: fetchCourses,
    crearTemario,
    cargarTemario
  };
};
