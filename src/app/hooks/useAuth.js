import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Custom Hook to interact with the global authentication store.
 * Employs Zustand under the hood to ensure consistent state distribution.
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError,
    initAuth
  } = useAuthStore();

  // Run initial state restoration check
  useEffect(() => {
    // Only run initialization if state is completely empty but hasn't been set yet
    if (!isAuthenticated && !user) {
      initAuth();
    }
  }, [isAuthenticated, user, initAuth]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearError
  };
};
