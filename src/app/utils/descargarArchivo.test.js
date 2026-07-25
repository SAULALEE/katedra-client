import test from 'node:test';
import assert from 'node:assert/strict';
import { nombreDesdeContentDisposition } from './descargarArchivo.js';

test('lee el nombre de archivo simple entre comillas', () => {
  assert.equal(
    nombreDesdeContentDisposition('attachment; filename="matematicas-teoria.pdf"'),
    'matematicas-teoria.pdf'
  );
});

test('lee el nombre sin comillas', () => {
  assert.equal(nombreDesdeContentDisposition('attachment; filename=teoria.md'), 'teoria.md');
});

test('decodifica el nombre codificado en RFC 5987', () => {
  assert.equal(
    nombreDesdeContentDisposition("attachment; filename*=UTF-8''Matem%C3%A1ticas.pdf"),
    'Matemáticas.pdf'
  );
});

test('prefiere filename* cuando ambos están presentes', () => {
  const cabecera = 'attachment; filename="Matematicas.pdf"; filename*=UTF-8\'\'Matem%C3%A1ticas.pdf';

  assert.equal(nombreDesdeContentDisposition(cabecera), 'Matemáticas.pdf');
});

test('devuelve null cuando no hay cabecera o no trae nombre', () => {
  assert.equal(nombreDesdeContentDisposition(undefined), null);
  assert.equal(nombreDesdeContentDisposition(''), null);
  assert.equal(nombreDesdeContentDisposition('attachment'), null);
});
