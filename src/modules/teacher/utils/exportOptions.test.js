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

test('opcionesDePieza bloquea Markdown y Google Forms cuando el plan no lo permite', () => {
  const teoria = opcionesDePieza('teoria', { puedeExportarAvanzado: false });
  const evaluacion = opcionesDePieza('evaluacion', { puedeExportarAvanzado: false });

  assert.equal(teoria.find(o => o.id === 'md').locked, true);
  assert.equal(teoria.find(o => o.id === 'docx').locked, false);
  assert.equal(teoria.find(o => o.id === 'pdf').locked, false);
  assert.equal(evaluacion.find(o => o.id === 'gs').locked, true);
  assert.equal(evaluacion.find(o => o.id === 'md').locked, true);
});

test('opcionesDePieza no bloquea nada cuando el plan permite exportación avanzada', () => {
  const opciones = opcionesDePieza('evaluacion', { puedeExportarAvanzado: true });

  assert.ok(opciones.every(o => o.locked === false));
});
