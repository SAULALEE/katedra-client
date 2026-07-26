import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  getAuthErrorMessage,
  getGoogleOAuthUrl,
  getOAuthErrorMessage,
  isSessionWithinTolerance,
  validateLoginFields,
  validateRegisterFields,
  parseOAuthCallback
} from './authService.js';

const encodePayload = (payload) =>
  btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

test('construye la URL de Google desde la configuración central de API', () => {
  assert.equal(getGoogleOAuthUrl(), '/api/v1/auth/google');
});

test('procesa el JWT OAuth y devuelve una URL limpia', () => {
  const token = `header.${encodePayload({
    sub: 'profesor-1',
    email: 'profesor@katedra.mx',
    name: 'Ada Docente',
    role: 'ROLE_PROFESOR'
  })}.signature`;

  const result = parseOAuthCallback(
    `http://localhost/auth/callback?token=${token}`
  );

  assert.equal(result.session.token, token);
  assert.deepEqual(result.session.user, {
    id: 'profesor-1',
    email: 'profesor@katedra.mx',
    nombre: 'Ada Docente',
    rol: 'ROLE_PROFESOR',
    avatarInitials: 'AD'
  });
  assert.equal(result.cleanUrl, '/auth/callback');
});

test('rechaza un callback sin JWT', () => {
  assert.throws(
    () => parseOAuthCallback('http://localhost/auth/callback'),
    /Token OAuth no proporcionado/
  );
});

test('rechaza un token que no tiene formato JWT', () => {
  assert.throws(
    () => parseOAuthCallback('http://localhost/auth/callback?token=no-es-jwt'),
    /JWT OAuth inválido/
  );
});

test('muestra el mensaje específico para una cuenta local existente', () => {
  assert.equal(
    getOAuthErrorMessage('local_account_exists'),
    'Este correo ya está registrado con contraseña. Inicia sesión con correo y contraseña.'
  );
});

test('muestra un mensaje amigable para otros errores de Google', () => {
  assert.equal(
    getOAuthErrorMessage('access_denied'),
    'No se pudo completar el acceso con Google. Inténtalo de nuevo.'
  );
});

test('conserva una sesión cuya última actividad fue hace menos de 15 minutos', () => {
  assert.equal(isSessionWithinTolerance(1000, 1000 + 15 * 60 * 1000 - 1), true);
});

test('expira una sesión al alcanzar 15 minutos fuera de Katedra', () => {
  assert.equal(isSessionWithinTolerance(1000, 1000 + 15 * 60 * 1000), false);
});

test('no restaura sesiones antiguas sin registro de última actividad', () => {
  assert.equal(isSessionWithinTolerance(null, Date.now()), false);
});

test('login valida campos obligatorios y formato de correo', () => {
  assert.equal(
    validateLoginFields('', ''),
    'Por favor, completa todos los campos.'
  );
  assert.equal(
    validateLoginFields('correo-invalido', 'secreto'),
    'Ingresa un correo electrónico válido.'
  );
  assert.equal(validateLoginFields('docente@katedra.mx', 'secreto'), null);
});

test('registro conserva las reglas actuales de contraseña y confirmación', () => {
  assert.equal(
    validateRegisterFields('', '', '', ''),
    'Por favor, completa todos los campos.'
  );
  assert.equal(
    validateRegisterFields('Ada', 'correo-invalido', 'secreto', 'secreto'),
    'Ingresa un correo electrónico válido.'
  );
  assert.equal(
    validateRegisterFields('Ada', 'ada@katedra.mx', '12345', '12345'),
    'La contraseña debe tener al menos 6 caracteres.'
  );
  assert.equal(
    validateRegisterFields('Ada', 'ada@katedra.mx', 'secreto', 'distinta'),
    'Las contraseñas no coinciden.'
  );
});

test('login traduce credenciales incorrectas y cuenta social desde respuestas reales', () => {
  assert.equal(
    getAuthErrorMessage({
      response: { status: 500, data: { message: 'Usuario no encontrado' } }
    }, 'login'),
    'Correo o contraseña incorrectos.'
  );
  assert.equal(
    getAuthErrorMessage({
      response: { status: 500, data: { message: 'Esta cuenta usa login social' } }
    }, 'login'),
    'Esta cuenta utiliza Google. Continúa con Google para iniciar sesión.'
  );
});

test('registro traduce correo duplicado y conserva validaciones del backend', () => {
  assert.equal(
    getAuthErrorMessage({
      response: { status: 500, data: { message: 'El email ya está registrado' } }
    }, 'register'),
    'Este correo ya está registrado. Inicia sesión o utiliza otro correo.'
  );
  assert.equal(
    getAuthErrorMessage({
      response: {
        status: 400,
        data: { errors: { password: 'Debe incluir una mayúscula' } }
      }
    }, 'register'),
    'Debe incluir una mayúscula'
  );
});

test('distingue fallos de conexión y errores de servidor', () => {
  assert.equal(
    getAuthErrorMessage({ request: {} }, 'login'),
    'No se pudo conectar con Katedra. Revisa tu conexión e inténtalo de nuevo.'
  );
  assert.equal(
    getAuthErrorMessage({ response: { status: 503, data: {} } }, 'register'),
    'Katedra no pudo completar la solicitud. Inténtalo de nuevo más tarde.'
  );
});

test('normalizeAuthResponse lee mustChangePassword de la respuesta del backend', async () => {
  const source = await readFile(new URL('./authService.js', import.meta.url), 'utf8');

  assert.match(source, /mustChangePassword\s*:\s*Boolean\(data\.mustChangePassword\)/);
});

test('changePasswordRequest llama a POST /usuarios/me/password', async () => {
  const source = await readFile(new URL('./authService.js', import.meta.url), 'utf8');

  assert.match(source, /export const changePasswordRequest/);
  assert.match(source, /\/usuarios\/me\/password/);
});

test('login/register/changePassword distinguen errores de red de errores de credenciales', async () => {
  const source = await readFile(new URL('./authService.js', import.meta.url), 'utf8');

  assert.match(source, /No se pudo conectar con el servidor/);
  assert.match(source, /getAuthErrorMessage\(error, 'login'\)/);
  assert.match(source, /getAuthErrorMessage\(error, 'register'\)/);
  assert.match(source, /resolveAuthErrorMessage\(error, 'Error al cambiar la contraseña/);
});
