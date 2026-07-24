import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULOS_OPTIONS, getModulosOptions, isModulosValueValidForModelo } from './modulosOptions.js';

test('Tutor solo ofrece 4 o 6 módulos', () => {
  assert.deepEqual(MODULOS_OPTIONS.TUTOR.map(o => o.value), ['4', '6']);
});

test('Catedrático solo ofrece 8 o 10 módulos', () => {
  assert.deepEqual(MODULOS_OPTIONS.CATEDRATICO.map(o => o.value), ['8', '10']);
});

test('getModulosOptions devuelve las opciones del modelo indicado', () => {
  assert.deepEqual(getModulosOptions('TUTOR'), MODULOS_OPTIONS.TUTOR);
  assert.deepEqual(getModulosOptions('CATEDRATICO'), MODULOS_OPTIONS.CATEDRATICO);
});

test('getModulosOptions usa TUTOR como respaldo ante un modelo desconocido', () => {
  assert.deepEqual(getModulosOptions('INEXISTENTE'), MODULOS_OPTIONS.TUTOR);
  assert.deepEqual(getModulosOptions(undefined), MODULOS_OPTIONS.TUTOR);
});

test('isModulosValueValidForModelo valida solo los valores del modelo activo', () => {
  assert.equal(isModulosValueValidForModelo('TUTOR', '4'), true);
  assert.equal(isModulosValueValidForModelo('TUTOR', '6'), true);
  assert.equal(isModulosValueValidForModelo('TUTOR', '8'), false);
  assert.equal(isModulosValueValidForModelo('CATEDRATICO', '10'), true);
  assert.equal(isModulosValueValidForModelo('CATEDRATICO', '4'), false);
});
