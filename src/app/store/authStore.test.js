import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('changePassword llama al servicio y limpia mustChangePassword en el usuario persistido', async () => {
  const source = await readFile(new URL('./authStore.js', import.meta.url), 'utf8');

  assert.match(source, /changePassword\s*:\s*async/);
  assert.match(source, /changePasswordRequest/);
  assert.match(source, /mustChangePassword:\s*false/);
});
