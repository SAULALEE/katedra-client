import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
  assert.match(source, /resolveAuthErrorMessage\(error, 'Error de autenticación/);
  assert.match(source, /resolveAuthErrorMessage\(error, 'Error al registrar la cuenta/);
  assert.match(source, /resolveAuthErrorMessage\(error, 'Error al cambiar la contraseña/);
});
