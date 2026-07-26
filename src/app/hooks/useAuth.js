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
    recordLastActivity
  } = useAuthStore();

  // Run initial state restoration check
  useEffect(() => {
    if (!isAuthenticated && !user) {
      initAuth();
    }
  }, [isAuthenticated, user, initAuth]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const handleLeave = () => recordLastActivity();
    window.addEventListener('pagehide', handleLeave);
    window.addEventListener('beforeunload', handleLeave);
    return () => {
      window.removeEventListener('pagehide', handleLeave);
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [isAuthenticated, recordLastActivity]);

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
    handleOAuthCallback
  };
};
