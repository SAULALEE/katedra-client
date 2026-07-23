import test from 'node:test';
import assert from 'node:assert/strict';
import { agruparTemariosPorAsignatura, filtrarTemarios } from './asignaturas.js';

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

test('busca dinámicamente por asignatura o título sin distinguir acentos', () => {
  const temarios = [
    { id: '1', titulo: 'Álgebra lineal', asignatura: 'Matemáticas' },
    { id: '2', titulo: 'Mecánica', asignatura: 'Física' }
  ];

  assert.deepEqual(filtrarTemarios(temarios, { busqueda: 'matematicas' }), [temarios[0]]);
  assert.deepEqual(filtrarTemarios(temarios, { busqueda: 'mecanica' }), [temarios[1]]);
});

test('filtra por un grado académico exacto', () => {
  const temarios = [
    { id: '1', gradoAcademico: 'Primaria' },
    { id: '2', gradoAcademico: 'Universidad' },
    { id: '3', gradoAcademico: 'Secundaria, Preparatoria' }
  ];

  assert.deepEqual(filtrarTemarios(temarios, { grado: 'Preparatoria' }), [temarios[2]]);
});

test('combina búsqueda y grado académico', () => {
  const temarios = [
    { id: '1', titulo: 'Álgebra', asignatura: 'Matemáticas', gradoAcademico: 'Secundaria' },
    { id: '2', titulo: 'Cálculo', asignatura: 'Matemáticas', gradoAcademico: 'Universidad' }
  ];

  assert.deepEqual(
    filtrarTemarios(temarios, { busqueda: 'matemáticas', grado: 'Universidad' }),
    [temarios[1]]
  );
});
