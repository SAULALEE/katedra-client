import { useEffect } from 'react';
import { useTemarioStore } from '../store/temarioStore';

/**
 * Custom Hook to interface with global temarios (courses) Zustand store.
 * Fully compliant with the application core architecture guidelines.
 */
export const useTemarios = () => {
  const {
    courses,
    assignmentCourses,
    assignmentLoading,
    favoriteCourses,
    favoritesLoading,
    loading,
    error,
    aiCalls,
    sourceContent,
    sourceLoading,
    sourceError,
    fetchCourses,
    fetchCoursesByAsignatura,
    fetchFavoritos,
    toggleFavorito,
    fetchStats,
    fetchFuenteTemario,
    clearFuenteTemario,
    crearTemario,
    cargarTemario,
    updateTemario,
    deleteTemario
  } = useTemarioStore();

  // Load courses on component mount if empty
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    courses,
    assignmentCourses,
    assignmentLoading,
    favoriteCourses,
    favoritesLoading,
    loading,
    error,
    aiCalls,
    sourceContent,
    sourceLoading,
    sourceError,
    refetchCourses: fetchCourses,
    fetchCoursesByAsignatura,
    fetchFavoritos,
    toggleFavorito,
    refetchStats: fetchStats,
    fetchFuenteTemario,
    clearFuenteTemario,
    crearTemario,
    cargarTemario,
    updateTemario,
    deleteTemario
  };
};
