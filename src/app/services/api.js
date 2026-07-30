import axios from 'axios';

// Optional chaining matters: `import.meta.env` is injected by Vite and is undefined when these
// modules are imported by the plain `node --test` suite. Without it, every test that transitively
// imports this file dies on a TypeError before running a single assertion.
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically inject the JWT Bearer Token if present
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isPublicAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/google') ||
      url.includes('/oauth2/');

    if (isPublicAuthRequest) {
      return config;
    }

    const token = localStorage.getItem('katedra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const isPublicAuthRequest = (url = '') =>
  url.includes('/auth/login') ||
  url.includes('/auth/register') ||
  url.includes('/auth/google') ||
  url.includes('/oauth2/');

// Response interceptor: an expired/revoked token otherwise keeps producing
// failed requests silently instead of forcing the user back to login.
// Clears storage directly (not via authStore.logout(), which itself calls
// the API and would re-trigger this same 401 path) and hard-navigates so
// the whole app re-initializes from the now-empty session, avoiding a
// circular import with authStore/authService (both import this module).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if (status === 401 && !isPublicAuthRequest(url)) {
      localStorage.removeItem('katedra_user');
      localStorage.removeItem('katedra_token');
      localStorage.removeItem('katedra_last_active');

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
