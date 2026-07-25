import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('ProtectedRoute redirige a /cambiar-password cuando el usuario debe cambiar su contraseña', async () => {
  const source = await readFile(new URL('./ProtectedRoute.jsx', import.meta.url), 'utf8');

  assert.match(source, /mustChangePassword/);
  assert.match(source, /\/cambiar-password/);
});
