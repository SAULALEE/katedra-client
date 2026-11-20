import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import api from './api.js';
import {
  PASSWORD_LENGTH_ERROR,
  requestPasswordReset,
  resetPassword,
  validatePasswordReset,
  validateRecoveryEmail
} from './passwordRecoveryService.js';

test('validates the recovery email', () => {
  assert.equal(validateRecoveryEmail(''), 'Ingresa tu correo electrónico.');
  assert.equal(validateRecoveryEmail('   '), 'Ingresa tu correo electrónico.');
  assert.equal(validateRecoveryEmail('not-an-email'), 'Ingresa un correo electrónico válido.');
  assert.equal(validateRecoveryEmail(' profe@escuela.edu '), null);
});

test('validates the new password length and confirmation', () => {
  assert.equal(validatePasswordReset('', ''), 'Completa ambos campos de contraseña.');
  assert.equal(validatePasswordReset('1234567', '1234567'), PASSWORD_LENGTH_ERROR);
  assert.equal(validatePasswordReset('x'.repeat(101), 'x'.repeat(101)), PASSWORD_LENGTH_ERROR);
  assert.equal(validatePasswordReset('secreto88', 'distinta99'), 'Las contraseñas no coinciden.');
  assert.equal(validatePasswordReset('x'.repeat(8), 'x'.repeat(8)), null);
  assert.equal(validatePasswordReset('x'.repeat(100), 'x'.repeat(100)), null);
});

test('posts recovery requests to the API', async () => {
  const originalAdapter = api.defaults.adapter;
  const requests = [];
  api.defaults.adapter = async (config) => {
    requests.push({ url: config.url, data: JSON.parse(config.data) });
    return { data: {}, status: 202, statusText: 'Accepted', headers: {}, config };
  };

  try {
    await requestPasswordReset('profe@escuela.edu');
    await resetPassword('raw-token', 'nueva-secreta');
  } finally {
    api.defaults.adapter = originalAdapter;
  }

  assert.deepEqual(requests, [
    { url: '/auth/password/forgot', data: { email: 'profe@escuela.edu' } },
    { url: '/auth/password/reset', data: { token: 'raw-token', newPassword: 'nueva-secreta' } }
  ]);
});

test('teacher login links to recovery and both pages are routed', async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
  const [app, login, forgot, reset] = await Promise.all([
    read('../../App.jsx'),
    read('../pages/Login.jsx'),
    read('../pages/ForgotPassword.jsx'),
    read('../pages/ResetPassword.jsx')
  ]);

  assert.match(app, /path="\/recuperar-contrasena" element={<ForgotPassword \/>}/);
  assert.match(app, /path="\/restablecer-contrasena" element={<ResetPassword \/>}/);
  assert.match(login, /<Link to="\/recuperar-contrasena"/);
  assert.doesNotMatch(login, /href="#"/);
  for (const page of [forgot, reset]) {
    assert.doesNotMatch(page, /localStorage|sessionStorage|console\.(log|error)/);
  }
  // The token must leave the address bar once read.
  assert.match(reset, /navigate\('\/restablecer-contrasena', \{ replace: true \}\)/);
});
