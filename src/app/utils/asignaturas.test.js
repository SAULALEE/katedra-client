import test from 'node:test';
import assert from 'node:assert/strict';
import { agruparTemariosPorAsignatura } from './asignaturas.js';

test('agrupa los temarios por asignatura conservando su orden', () => {
  const temarios = [
    { id: '1', titulo: 'Álgebra', asignatura: 'Matemáticas', temas: 4 },
    { id: '2', titulo: 'Geometría', asignatura: 'Matemáticas', temas: 6 },
    { id: '3', titulo: 'Mecánica', asignatura: 'Física', temas: 5 }
  ];

  assert.deepEqual(agruparTemariosPorAsignatura(temarios), [
    { nombre: 'Matemáticas', temarios: temarios.slice(0, 2), totalTemas: 10 },
    { nombre: 'Física', temarios: temarios.slice(2), totalTemas: 5 }
  ]);
});

test('usa un nombre común cuando un temario no tiene asignatura', () => {
  const temarios = [{ id: '1', titulo: 'Temario sin asignatura' }];

  assert.equal(agruparTemariosPorAsignatura(temarios)[0].nombre, 'Sin asignatura');
});
