import api, { API_BASE_URL } from './api.js';

export const SESSION_LAST_ACTIVE_KEY = 'katedra_last_active';
export const SESSION_TOLERANCE_MS = 15 * 60 * 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isSessionWithinTolerance = (lastActive, now = Date.now()) => {
  if (lastActive === null || lastActive === undefined || lastActive === '') {
    return false;
  }

  const timestamp = Number(lastActive);
  return Number.isFinite(timestamp) &&
    now >= timestamp &&
    now - timestamp < SESSION_TOLERANCE_MS;
};

export const validateLoginFields = (email, password) => {
  if (!email?.trim() || !password) {
    return 'Por favor, completa todos los campos.';
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Ingresa un correo electrónico válido.';
  }
  return null;
};

export const validateRegisterFields = (nombre, email, password, confirmPassword) => {
  if (!nombre?.trim() || !email?.trim() || !password || !confirmPassword) {
    return 'Por favor, completa todos los campos.';
  }
  if (!EMAIL_PATTERN.test(email.trim())) {
    return 'Ingresa un correo electrónico válido.';
  }
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden.';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  return null;
};

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getValidationMessage = (errors) => {
  if (Array.isArray(errors)) {
    return errors.find((value) => typeof value === 'string') || null;
  }
  if (errors && typeof errors === 'object') {
    for (const value of Object.values(errors)) {
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) {
        const message = value.find((item) => typeof item === 'string');
        if (message) return message;
      }
    }
  }
  return null;
};

export const getAuthErrorMessage = (error, flow) => {
  const response = error?.response;
  if (!response) {
    return 'No se pudo conectar con Katedra. Revisa tu conexión e inténtalo de nuevo.';
  }

  const data = response.data;
  const backendMessage =
    (typeof data === 'string' ? data : null) ||
    getValidationMessage(data?.errors) ||
    data?.message ||
    data?.detail;
  const normalized = normalizeText(backendMessage);

  if (flow === 'login') {
    if (normalized.includes('login social')) {
      return 'Esta cuenta utiliza Google. Continúa con Google para iniciar sesión.';
    }
    if (
      response.status === 401 ||
      normalized.includes('bad credentials') ||
      normalized.includes('usuario no encontrado') ||
      normalized.includes('credenciales')
    ) {
      return 'Correo o contraseña incorrectos.';
    }
  }

  if (
    flow === 'register' &&
    normalized.includes('email') &&
    normalized.includes('registrad')
  ) {
    return 'Este correo ya está registrado. Inicia sesión o utiliza otro correo.';
  }

  if (response.status >= 400 && response.status < 500 && backendMessage) {
    return backendMessage;
  }

  return 'Katedra no pudo completar la solicitud. Inténtalo de nuevo más tarde.';
};

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

export const normalizeAuthResponse = (data = {}) => {
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
      avatarInitials: getAvatarInitials(nombre),
      mustChangePassword: Boolean(data.mustChangePassword)
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
  if (!payload) {
    throw new Error('JWT OAuth inválido');
  }

  const nombre =
    payload.nombre ||
    payload.name ||
    payload.usuario?.nombre ||
    payload.given_name ||
    'Usuario Katedra';
  const email =
    payload.email ||
    payload.preferred_username ||
    payload.upn ||
    payload.sub ||
    '';
  const rol =
    payload.rol ||
    payload.role ||
    payload.authorities?.[0] ||
    payload.roles?.[0] ||
    payload.usuario?.rol ||
    'ROLE_PROFESOR';
  const id =
    payload.id ||
    payload.userId ||
    payload.usuarioId ||
    payload.sub ||
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

export const parseOAuthCallback = (url) => {
  const currentUrl = new URL(url);
  const token = currentUrl.searchParams.get('token');
  const session = buildSessionFromToken(token);

  currentUrl.searchParams.delete('token');

  return {
    session,
    cleanUrl: `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
  };
};

export const getGoogleOAuthUrl = () => `${API_BASE_URL}/auth/google`;

export const getOAuthErrorMessage = (errorCode) => {
  if (errorCode === 'local_account_exists') {
    return 'Este correo ya está registrado con contraseña. Inicia sesión con correo y contraseña.';
  }

  return 'No se pudo completar el acceso con Google. Inténtalo de nuevo.';
};

/**
 * Resolves a user-facing message for an auth-related request failure.
 * Distinguishes "no response reached the server" (network/CORS/timeout) from
 * an actual error response, since those need different guidance.
 */
const resolveAuthErrorMessage = (error, fallback) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.';
  }
  return error.response.data?.message || error.response.data?.error || fallback;
};

export const startGoogleLogin = () => {
  window.location.assign(getGoogleOAuthUrl());
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
    throw new Error(getAuthErrorMessage(error, 'login'), { cause: error });
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
    throw new Error(getAuthErrorMessage(error, 'register'), { cause: error });
  }
};

/**
 * Changes the password of the currently authenticated user.
 *
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<object>} Returns mapped user details and a fresh JWT token.
 */
export const changePasswordRequest = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/usuarios/me/password', { currentPassword, newPassword });
    return normalizeAuthResponse(response.data);
  } catch (error) {
    const errorMessage = resolveAuthErrorMessage(error, 'Error al cambiar la contraseña.');
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
