import api from './api';

const getAvatarInitials = (nombre) => {
  if (!nombre) return 'U';

  return nombre
    .split(' ')
    .filter(Boolean)
    .map((segment) => segment[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const normalizeAuthResponse = (data = {}) => {
  const token = data.token || data.accessToken || data.jwt;
  const usuario = data.usuario || data.user || {};
  const nombre = usuario.nombre || usuario.name || data.nombre || 'Usuario Katedra';
  const email = usuario.email || data.email || '';
  const id = usuario.id || data.id || email || `auth-${Date.now()}`;
  const rol = usuario.rol || usuario.role || data.rol || data.role || 'ROLE_PROFESOR';

  return {
    user: {
      id,
      email,
      nombre,
      rol,
      avatarInitials: getAvatarInitials(nombre)
    },
    token
  };
};

const decodeJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');
    const decoded = atob(padded);
    const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
    const text = new TextDecoder().decode(bytes);
    return JSON.parse(text);
  } catch (error) {
    console.warn('No se pudo decodificar el JWT OAuth:', error);
    return null;
  }
};

export const buildSessionFromToken = (token) => {
  if (!token) {
    throw new Error('Token OAuth no proporcionado');
  }

  const payload = decodeJwtPayload(token);
  const nombre =
    payload?.nombre ||
    payload?.name ||
    payload?.usuario?.nombre ||
    payload?.given_name ||
    'Usuario Katedra';
  const email =
    payload?.email ||
    payload?.preferred_username ||
    payload?.upn ||
    payload?.sub ||
    '';
  const rol =
    payload?.rol ||
    payload?.role ||
    payload?.authorities?.[0] ||
    payload?.roles?.[0] ||
    payload?.usuario?.rol ||
    'ROLE_PROFESOR';
  const id =
    payload?.id ||
    payload?.userId ||
    payload?.usuarioId ||
    payload?.sub ||
    `oauth-${Date.now()}`;

  return {
    user: {
      id,
      email,
      nombre,
      rol,
      avatarInitials: getAvatarInitials(nombre)
    },
    token
  };
};

export const startGoogleLogin = () => {
  window.location.href = '/api/v1/auth/google';
};

export const startMicrosoftLogin = () => {
  window.location.href = '/api/v1/auth/microsoft';
};

/**
 * Authenticates user with email and password using the real backend API.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Returns mapped user details and the JWT token.
 */
export const loginRequest = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return normalizeAuthResponse(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || 'Error de autenticación. Por favor, compruebe sus credenciales.';
    throw new Error(errorMessage, { cause: error });
  }
};

/**
 * Registers a new user with email, password, and name using the backend API.
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} nombre 
 * @returns {Promise<object>} Returns mapped user details and the JWT token.
 */
export const registerRequest = async (email, password, nombre) => {
  try {
    const url = '/auth/register';
    const payload = { email, password, nombre };
    const response = await api.post(url, payload);
    return normalizeAuthResponse(response.data);
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || 'Error al registrar la cuenta. Por favor, intente de nuevo.';
    throw new Error(errorMessage, { cause: error });
  }
};

/**
 * Performs a logout request on the backend if configured, and returns true.
 * 
 * @returns {Promise<boolean>}
 */
export const logoutRequest = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Backend logout endpoint failed or not active:', error);
  }
  return true;
};
