import api from './api.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_LENGTH_ERROR = 'La contraseña debe tener entre 8 y 100 caracteres.';

export function validateRecoveryEmail(email) {
  if (!email?.trim()) return 'Ingresa tu correo electrónico.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Ingresa un correo electrónico válido.';
  return null;
}

export function validatePasswordReset(password, confirmPassword) {
  if (!password || !confirmPassword) return 'Completa ambos campos de contraseña.';
  if (password.length < 8 || password.length > 100) return PASSWORD_LENGTH_ERROR;
  if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
  return null;
}

// The backend always answers 202 for /forgot, so callers must show a neutral message.
export const requestPasswordReset = async (email) => {
  await api.post('/auth/password/forgot', { email });
};

export const resetPassword = async (token, newPassword) => {
  await api.post('/auth/password/reset', { token, newPassword });
};
