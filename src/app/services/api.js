import axios from 'axios';

export const API_BASE_URL = '/api/v1';

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

export default api;
