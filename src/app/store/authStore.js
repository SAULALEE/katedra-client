import { create } from 'zustand';
import { loginRequest, logoutRequest } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  /**
   * Initializes authentication state by restoring credentials from localStorage.
   */
  initAuth: () => {
    try {
      const storedUser = localStorage.getItem('katedra_user');
      const storedToken = localStorage.getItem('katedra_token');

      if (storedUser && storedToken) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          error: null
        });
      }
    } catch (e) {
      console.error('Failed to restore auth session from localStorage:', e);
      localStorage.removeItem('katedra_user');
      localStorage.removeItem('katedra_token');
    }
  },

  /**
   * Attempts to authenticate user with email and password.
   */
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest(email, password);
      
      localStorage.setItem('katedra_user', JSON.stringify(data.user));
      localStorage.setItem('katedra_token', data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      return true;
    } catch (err) {
      set({
        error: err.message || 'Error al iniciar sesión',
        loading: false,
        isAuthenticated: false
      });
      return false;
    }
  },

  /**
   * Logs out current user and clears session state.
   */
  logout: async () => {
    set({ loading: true });
    try {
      await logoutRequest();
    } catch (e) {
      console.error('API logout failed, performing local logout:', e);
    } finally {
      localStorage.removeItem('katedra_user');
      localStorage.removeItem('katedra_token');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  /**
   * Clears any existing authentication errors.
   */
  clearError: () => set({ error: null })
}));
