import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PIEZA_POR_TAB,
  EXTENSION_POR_FORMATO,
  OPCIONES_EXPORTACION,
  opcionesDePieza
} from './exportOptions.js';

test('traduce el id de pestaña "slides" a la pieza del backend', () => {
  assert.equal(PIEZA_POR_TAB.slides, 'diapositivas');
  assert.equal(PIEZA_POR_TAB.diapositivas, 'diapositivas');
  assert.equal(PIEZA_POR_TAB.teoria, 'teoria');
  assert.equal(PIEZA_POR_TAB.evaluacion, 'evaluacion');
});

test('ofrece los formatos acordados para cada pieza', () => {
  assert.deepEqual(OPCIONES_EXPORTACION.teoria.map(o => o.id), ['docx', 'pdf', 'md']);
  assert.deepEqual(OPCIONES_EXPORTACION.evaluacion.map(o => o.id), ['docx', 'pdf', 'md', 'gs']);
  assert.deepEqual(OPCIONES_EXPORTACION.diapositivas.map(o => o.id), ['pptx', 'pdf']);
});

test('no ofrece markdown para las diapositivas', () => {
  assert.ok(!OPCIONES_EXPORTACION.diapositivas.some(o => o.id === 'md'));
});

test('cada formato conoce su extensión de archivo', () => {
  const formatos = new Set(Object.values(OPCIONES_EXPORTACION).flat().map(o => o.id));
  for (const formato of formatos) {
    assert.ok(EXTENSION_POR_FORMATO[formato], `falta la extensión de ${formato}`);
  }
});

test('opcionesDePieza devuelve una lista vacía para una pieza desconocida', () => {
  assert.deepEqual(opcionesDePieza('resumen'), []);
});

test('opcionesDePieza marca como deshabilitadas las opciones sin contenido', () => {
  const opciones = opcionesDePieza('teoria', { disponible: false });

  assert.ok(opciones.length > 0);
  assert.ok(opciones.every(o => o.disabled === true));
});
