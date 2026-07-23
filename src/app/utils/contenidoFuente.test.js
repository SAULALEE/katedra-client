import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararContenidoFuente } from './contenidoFuente.js';

test('separa texto URL extenso en bloques sin cambiar sus palabras', () => {
  const fuente = 'Primer concepto explicado con detalle. Continúa la explicación del concepto. Segundo bloque importante para la lectura. Finaliza el contenido de la fuente.';
  const presentado = prepararContenidoFuente(fuente);

  assert.match(presentado, /\n\n/);
  assert.equal(presentado.replace(/\s+/g, ' ').trim(), fuente);
});

test('reconoce encabezados y conserva listas del texto plano', () => {
  const fuente = 'INTRODUCCIÓN\nConceptos principales:\n- Primer elemento\n- Segundo elemento\nConclusión del tema.';
  const presentado = prepararContenidoFuente(fuente);

  assert.match(presentado, /^## INTRODUCCIÓN/m);
  assert.match(presentado, /^### Conceptos principales:/m);
  assert.match(presentado, /- Primer elemento\n- Segundo elemento/);
  assert.equal(
    presentado.replace(/^#{2,3} /gm, '').replace(/\n+/g, '\n'),
    fuente
  );
});
