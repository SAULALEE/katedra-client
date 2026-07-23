import test from 'node:test';
import assert from 'node:assert/strict';
import api from './api.js';
import {
  crearAsignaturaRequest,
  eliminarAsignaturaRequest,
  getAsignatura,
  getAsignaturas
} from './asignaturaService.js';

globalThis.localStorage = { getItem: () => null };

const withAdapter = async (adapter, callback) => {
  const previousAdapter = api.defaults.adapter;
  let capturedConfig;
  api.defaults.adapter = async (config) => {
    capturedConfig = config;
    return adapter(config);
  };

  try {
    const result = await callback();
    return { result, config: capturedConfig };
  } finally {
    api.defaults.adapter = previousAdapter;
  }
};

const ok = (data, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config: {} });

test('obtiene las asignaturas desde su endpoint', async () => {
  const asignaturas = [{ id: 'a-1', nombre: 'Matemáticas', descripcion: 'Ciencias exactas' }];
  const { result, config } = await withAdapter(() => ok(asignaturas), getAsignaturas);

  assert.equal(config.url, '/asignaturas');
  assert.deepEqual(result, asignaturas);
});

test('obtiene el detalle de una asignatura', async () => {
  const asignatura = { id: 'a-1', nombre: 'Matemáticas', descripcion: 'Ciencias exactas' };
  const { result, config } = await withAdapter(() => ok(asignatura), () => getAsignatura('a-1'));

  assert.equal(config.url, '/asignaturas/a-1');
  assert.deepEqual(result, asignatura);
});

test('crea una asignatura con nombre y descripción exclusivamente', async () => {
  const payload = { nombre: 'Historia', descripcion: 'Historia universal' };
  const { result, config } = await withAdapter(() => ok({ id: 'a-2', ...payload }, 201), () => crearAsignaturaRequest(payload));

  assert.equal(config.url, '/asignaturas');
  assert.deepEqual(JSON.parse(config.data), payload);
  assert.deepEqual(result, { id: 'a-2', ...payload });
});

test('elimina una asignatura por id', async () => {
  const { config } = await withAdapter(() => ok(null, 204), () => eliminarAsignaturaRequest('a-1'));
  assert.equal(config.url, '/asignaturas/a-1');
  assert.equal(config.method, 'delete');
});

test('conserva el mensaje del backend cuando una asignatura contiene temarios', async () => {
  await assert.rejects(
    () => withAdapter(() => Promise.reject({
      response: { status: 409, data: { message: 'La asignatura contiene temarios' } }
    }), () => eliminarAsignaturaRequest('a-1')),
    (error) => error.message === 'La asignatura contiene temarios' && error.cause.response.status === 409
  );
});
