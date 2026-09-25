import { create } from 'zustand';
import { useSuscripcionStore } from './suscripcionStore.js';
import {
  changePasswordRequest,
  isSessionWithinTolerance,
  loginRequest,
  logoutRequest,
  parseOAuthCallback,
  registerRequest,
  registerStudentRequest,
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
  initialized: false,
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
          initialized: true,
          error: null
        });
        return;
      }

      clearLocalSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        initialized: true,
        error: null
      });
    } catch (e) {
      console.error('Failed to restore auth session from localStorage:', e);
      clearLocalSession();
      set({ user: null, token: null, isAuthenticated: false, initialized: true, error: null });
    }
  },

  /**
   * Attempts to authenticate user with email and password.
   */
  login: async (email, password, now = Date.now(), expectedRole = null) => {
    set({ loading: true, error: null });
    try {
      const data = await loginRequest(email, password);
      if (expectedRole && data.user.rol !== expectedRole) {
        throw new Error('Esta cuenta pertenece a otra sección de Katedra. Usa el acceso correspondiente.');
      }
      
      saveLocalSession(data, now);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        initialized: true,
        loading: false,
        error: null
      });
      return true;
    } catch (err) {
      clearLocalSession();
      set({
        error: err.message || 'Error al iniciar sesión',
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        initialized: true
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

  registerStudent: async (email, password, nombre) => {
    set({ loading: true, error: null });
    try {
      const data = await registerStudentRequest(email, password, nombre);
      if (data.user.rol !== 'ROLE_ALUMNO') throw new Error('No se pudo crear una cuenta de alumno.');
      saveLocalSession(data);
      set({ user: data.user, token: data.token, isAuthenticated: true, initialized: true, loading: false, error: null });
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al crear la cuenta', loading: false });
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

  /**
   * Refreshes the session user's plan after a subscription change.
   *
   * No new token is needed: the JWT `plan` claim is display-only and the backend always
   * reads the plan from the database. Also rewritten to localStorage so the badge survives
   * a reload without waiting for /suscripciones/me/uso.
   */
  actualizarPlan: (plan) => {
    const { user } = get();
    if (!user) return;

    const actualizado = { ...user, plan };
    localStorage.setItem('katedra_user', JSON.stringify(actualizado));
    set({ user: actualizado });
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

      // suscripcionStore is a module-level singleton: without this, the next account
      // logged into this same tab would inherit this one's cached plan/usage until a
      // full page reload, since cargarUso() only fetches when `uso` is still null.
      useSuscripcionStore.getState().resetear();
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
