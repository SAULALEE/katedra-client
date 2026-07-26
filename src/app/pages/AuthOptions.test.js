import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readPage = (name) =>
  readFile(new URL(`./${name}.jsx`, import.meta.url), 'utf8');

test('Login muestra Google y no ofrece autenticación con Apple', async () => {
  const source = await readPage('Login');

  assert.match(source, /Continuar con Google/);
  assert.doesNotMatch(source, />\s*Apple\s*</);
});

test('Register muestra Google y no ofrece autenticación con Apple', async () => {
  const source = await readPage('Register');

  assert.match(source, /Registrarse con Google/);
  assert.doesNotMatch(source, />\s*Apple\s*</);
});
