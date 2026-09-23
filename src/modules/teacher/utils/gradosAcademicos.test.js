import test from 'node:test';
import assert from 'node:assert/strict';
import { GRADOS_ACADEMICOS, filtrarTemarios } from './asignaturas.js';

test('expone todos los grados soportados por Cargar Temario', () => {
  assert.deepEqual(GRADOS_ACADEMICOS, [
    'Primaria',
    'Secundaria',
    'Preparatoria',
    'Universidad',
    'Posgrado'
  ]);
});

test('filtra grados sin depender de mayúsculas o acentos', () => {
  const temarios = [
    { id: '1', gradoAcademico: 'UNIVERSIDAD' },
    { id: '2', gradoAcademico: 'Educación primaria' }
  ];

  assert.deepEqual(filtrarTemarios(temarios, { grado: 'Universidad' }), [temarios[0]]);
  assert.deepEqual(filtrarTemarios(temarios, { grado: '' }), temarios);
});
