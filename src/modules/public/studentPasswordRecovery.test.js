import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as studentPortal from './studentPortal.js';
import api from '../../app/services/api.js';

test('valida correo de recuperacion y la contrasena nueva', () => {
  assert.equal(typeof studentPortal.validateStudentRecoveryEmail, 'function');
  assert.equal(typeof studentPortal.validateStudentPasswordReset, 'function');
  assert.equal(studentPortal.validateStudentRecoveryEmail('alumna@escuela.edu'), null);
  assert.notEqual(studentPortal.validateStudentRecoveryEmail('incorrecto'), null);
  assert.notEqual(studentPortal.validateStudentPasswordReset('', ''), null);
  assert.equal(studentPortal.validateStudentPasswordReset('1234567', '1234567'), 'La contraseña debe tener entre 8 y 100 caracteres.');
  assert.equal(studentPortal.validateStudentPasswordReset('x'.repeat(101), 'x'.repeat(101)), 'La contraseña debe tener entre 8 y 100 caracteres.');
  assert.equal(studentPortal.validateStudentPasswordReset('secreto88', 'distinta99'), 'Las contraseñas no coinciden.');
  assert.equal(studentPortal.validateStudentPasswordReset('secreto88', 'secreto88'), null);
  assert.equal(studentPortal.validateStudentPasswordReset('x'.repeat(100), 'x'.repeat(100)), null);
});

test('la ayuda de alumnos dirige a la recuperacion funcional', () => {
  assert.match(studentPortal.getStudentChatReply('¿Cómo recupero mi contraseña?'), /recuperar-contrasena/);
});

test('la pantalla de recuperacion y su ruta no persisten ni exponen el token', async () => {
  const pages = await readFile(new URL('./pages/StudentPages.jsx', import.meta.url), 'utf8');
  const app = await readFile(new URL('../../App.jsx', import.meta.url), 'utf8');
  const apiClient = await readFile(new URL('../../app/services/api.js', import.meta.url), 'utf8');

  assert.match(pages, /requestStudentPasswordReset/);
  assert.match(pages, /resetStudentPassword/);
  assert.match(pages, /Establecer contrase/);
  assert.match(pages, /role="status"/);
  assert.match(pages, /role="alert"/);
  assert.doesNotMatch(pages, /localStorage|sessionStorage|console\.(log|error)/);
  assert.match(app, /path="restablecer-contrasena"/);
  assert.match(apiClient, /url\.includes\('\/auth\/password\/forgot'\)/);
  assert.match(apiClient, /url\.includes\('\/auth\/password\/reset'\)/);
});

test('envia recuperacion y restablecimiento a la API sin persistir el token', async () => {
  const serviceUrl = new URL('./services/studentPasswordRecoveryService.js', import.meta.url);
  assert.equal(existsSync(fileURLToPath(serviceUrl)), true);
  const { requestStudentPasswordReset, resetStudentPassword } = await import(serviceUrl.href);
  const originalAdapter = api.defaults.adapter;
  const originalStorage = globalThis.localStorage;
  const requests = [];
  let persistedValues = 0;
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => { persistedValues += 1; }
  };
  api.defaults.adapter = async (config) => {
    requests.push({ url: config.url, data: JSON.parse(config.data) });
    return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
  };

  try {
    await requestStudentPasswordReset('alumna@escuela.edu');
    await resetStudentPassword('token-privado', 'nueva-secreta');

    assert.deepEqual(requests, [
      { url: '/auth/password/forgot', data: { email: 'alumna@escuela.edu' } },
      { url: '/auth/password/reset', data: { token: 'token-privado', newPassword: 'nueva-secreta' } }
    ]);
    assert.equal(persistedValues, 0);
  } finally {
    api.defaults.adapter = originalAdapter;
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  }
});
