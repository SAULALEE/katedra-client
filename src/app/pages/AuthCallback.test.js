import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('AuthCallback procesa y navega una sola vez bajo StrictMode', async () => {
  const source = await readFile(
    new URL('./AuthCallback.jsx', import.meta.url),
    'utf8'
  );

  assert.match(source, /useRef\(false\)/);
  assert.match(source, /if \(hasHandledCallback\.current\) return;/);
  assert.match(source, /hasHandledCallback\.current = true;/);
});
