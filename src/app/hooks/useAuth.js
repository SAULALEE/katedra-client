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
    loginWithGoogle,
    loginWithMicrosoft,
    register,
    changePassword,
    logout,
    clearError,
    initAuth,
    handleOAuthCallback,
    actualizarPlan
  } = useAuthStore();

  // Run initial state restoration check
  useEffect(() => {
    if (!isAuthenticated && !user) {
      if (window.location.search.includes('token=')) {
        handleOAuthCallback();
        return;
      }

      initAuth();
    }
  }, [isAuthenticated, user, initAuth, handleOAuthCallback]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithMicrosoft,
    register,
    changePassword,
    logout,
    clearError,
    handleOAuthCallback,
    actualizarPlan
  };
};
