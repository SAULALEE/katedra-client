import { create } from 'zustand';
import {
  changePasswordRequest,
  isSessionWithinTolerance,
  loginRequest,
  logoutRequest,
  parseOAuthCallback,
  registerRequest,
  SESSION_LAST_ACTIVE_KEY,
  startGoogleLogin,
  startMicrosoftLogin
} from '../services/authService.js';

const clearLocalSession = () => {
  localStorage.removeItem('katedra_user');
  localStorage.removeItem('katedra_token');
  localStorage.removeItem(SESSION_LAST_ACTIVE_KEY);
};

const saveLocalSession = (session, now = Date.now()) => {
  localStorage.setItem('katedra_user', JSON.stringify(session.user));
  localStorage.setItem('katedra_token', session.token);
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(now));
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  /**
   * Initializes authentication state by restoring credentials from localStorage.
   */
  initAuth: (now = Date.now()) => {
    try {
      const storedUser = localStorage.getItem('katedra_user');
      const storedToken = localStorage.getItem('katedra_token');
      const lastActive = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);

      if (
        storedUser &&
        storedToken &&
        isSessionWithinTolerance(lastActive, now)
      ) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          error: null
        });
        return;
      }

      clearLocalSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      });
    } catch (e) {
      console.error('Failed to restore auth session from localStorage:', e);
      clearLocalSession();
    }
  },

  /**
   * Attempts to authenticate user with email and password.
   */
  login: async (email, password, now = Date.now()) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest(email, password);
      
      saveLocalSession(data, now);

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
   * Registers a new user account. Does not authenticate the caller;
   * they log in separately with their new credentials.
   */
  register: async (email, password, nombre) => {
    set({ loading: true, error: null });
    try {
      await registerRequest(email, password, nombre);
      set({ loading: false, error: null });
      return true;
    } catch (err) {
      set({
        error: err.message || 'Error al registrar la cuenta',
        loading: false,
        isAuthenticated: false
      });
      return false;
    }
  },

  /**
   * Changes the current user's password and clears the mustChangePassword flag.
   */
  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      const data = await changePasswordRequest(currentPassword, newPassword);
      const updatedUser = { ...data.user, mustChangePassword: false };

      saveLocalSession({ user: updatedUser, token: data.token });

      set({
        user: updatedUser,
        token: data.token,
        loading: false,
        error: null
      });
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al cambiar la contraseña', loading: false });
      return false;
    }
  },

  loginWithGoogle: () => {
    set({ error: null });
    startGoogleLogin();
  },

  loginWithMicrosoft: () => {
    set({ error: null });
    startMicrosoftLogin();
  },

  handleOAuthCallback: (now = Date.now()) => {
    try {
      const currentState = get();
      const callbackToken = new URL(window.location.href).searchParams.get('token');

      if (
        !callbackToken &&
        currentState.isAuthenticated &&
        currentState.user &&
        currentState.token
      ) {
        return {
          user: currentState.user,
          token: currentState.token
        };
      }

      const { session, cleanUrl } = parseOAuthCallback(window.location.href);

      saveLocalSession(session, now);

      window.history.replaceState({}, document.title, cleanUrl);

      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      return session;
    } catch (err) {
      clearLocalSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: err.message || 'Error al procesar el inicio de sesión social'
      });
      return null;
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
      clearLocalSession();

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  recordLastActivity: (now = Date.now()) => {
    if (useAuthStore.getState().isAuthenticated) {
      localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(now));
    }
  },

  /**
   * Clears any existing authentication errors.
   */
  clearError: () => set({ error: null })
}));
