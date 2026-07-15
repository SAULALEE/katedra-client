import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import api from './api.js';
import {
  crearTemarioRequest,
  cargarTemarioArchivoRequest,
  cargarTemarioUrlRequest,
  generarMaterialParaTemario,
  eliminarTemarioRequest,
  getTemarioStats,
  actualizarTemarioRequest
} from './temarioService.js';

globalThis.localStorage = {
  getItem: () => null
};

const temario = {
  id: 'temario-1',
  titulo: 'Álgebra',
  descripcion: 'Curso manual',
  gradoAcademico: 'Primaria, Secundaria, Diplomado',
  asignatura: 'Matemáticas'
};

const withAdapter = async (responseData, callback) => {
  let capturedConfig;
  const previousAdapter = api.defaults.adapter;
  api.defaults.adapter = async (config) => {
    capturedConfig = config;
    return { data: responseData, status: 201, statusText: 'Created', headers: {}, config };
  };

  try {
    const result = await callback();
    return { result, config: capturedConfig };
  } finally {
    api.defaults.adapter = previousAdapter;
  }
};

test('creación manual envía únicamente el contrato del backend', async () => {
  const { result, config } = await withAdapter(temario, () => crearTemarioRequest({
    ...temario,
    temas: 6,
    origen: 'Manual',
    detalleOrigen: ''
  }));

  assert.equal(config.url, '/temarios');
  assert.deepEqual(JSON.parse(config.data), {
    titulo: temario.titulo,
    descripcion: temario.descripcion,
    gradoAcademico: temario.gradoAcademico,
    asignatura: temario.asignatura
  });
  assert.deepEqual(result, temario);
});

test('carga por archivo envía multipart y devuelve el temario creado', async () => {
  const uploadResponse = { temario, contenidoId: 'contenido-1', archivoNombre: 'temario.md' };
  const file = new File(['# Temario'], 'temario.md', { type: 'text/markdown' });
  const { result, config } = await withAdapter(uploadResponse, () => cargarTemarioArchivoRequest({
    file,
    titulo: temario.titulo,
    asignatura: temario.asignatura,
    gradoAcademico: temario.gradoAcademico
  }));

  assert.equal(config.url, '/temarios/cargar/archivo');
  assert.equal(config.data.get('file'), file);
  assert.equal(config.data.get('titulo'), temario.titulo);
  assert.equal(config.data.get('asignatura'), temario.asignatura);
  assert.equal(config.data.get('gradoAcademico'), temario.gradoAcademico);
  assert.deepEqual(result, temario);
});

test('carga por URL envía el contrato exacto y devuelve el temario creado', async () => {
  const uploadResponse = { temario, contenidoId: 'contenido-2', fuenteUrl: 'https://example.com/temario' };
  const payload = {
    url: uploadResponse.fuenteUrl,
    titulo: temario.titulo,
    asignatura: temario.asignatura,
    gradoAcademico: temario.gradoAcademico
  };
  const { result, config } = await withAdapter(uploadResponse, () => cargarTemarioUrlRequest(payload));

  assert.equal(config.url, '/temarios/cargar/url');
  assert.deepEqual(JSON.parse(config.data), payload);
  assert.deepEqual(result, temario);
});

test('generación envía los modelos básico y avanzado', async () => {
  for (const modelo of ['basico', 'avanzado']) {
    const contenido = { id: 'contenido-1', modelo, piezasFallidas: {} };
    const { result, config } = await withAdapter(contenido, () => generarMaterialParaTemario('temario-1', {
      piezas: ['teoria', 'evaluacion', 'diapositivas'],
      modelo
    }));

    assert.equal(config.url, '/temarios/temario-1/generar-material');
    assert.deepEqual(JSON.parse(config.data), {
      piezas: ['teoria', 'evaluacion', 'diapositivas'],
      modelo
    });
    assert.deepEqual(result, contenido);
  }
});

test('selector de generación ofrece únicamente Básico y Avanzado', async () => {
  const source = await readFile(new URL('../hooks/useGenerator.js', import.meta.url), 'utf8');
  const modelosSource = source.slice(source.indexOf('export const MODELOS'), source.indexOf('export const MODELO_LABELS'));

  assert.match(modelosSource, /id: 'basico', label: 'Básico'/);
  assert.match(modelosSource, /id: 'avanzado', label: 'Avanzado'/);
  assert.doesNotMatch(modelosSource, /id: '(flash|pro|max)'/);
});

test('selector de archivo acepta PDF, DOC, DOCX y Markdown', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  assert.match(source, /accept="\.pdf,\.doc,\.docx,\.md"/);
});

test('Dashboard muestra el mensaje de error retornado por el store', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');

  assert.match(storeSource, /return \{ success: false, error: errorMessage \}/);
  assert.match(dashboardSource, /result\.error/);
});

test('errores de carga conservan el mensaje entregado por el backend', async () => {
  const previousAdapter = api.defaults.adapter;
  api.defaults.adapter = async () => {
    throw { response: { data: { message: 'El archivo excede el tamaño permitido' } } };
  };

  try {
    await assert.rejects(
      cargarTemarioArchivoRequest({
        file: new File(['contenido'], 'temario.md'),
        titulo: temario.titulo,
        asignatura: temario.asignatura,
        gradoAcademico: temario.gradoAcademico
      }),
      { message: 'El archivo excede el tamaño permitido' }
    );
  } finally {
    api.defaults.adapter = previousAdapter;
  }
});

test('eliminación usa el endpoint existente del temario', async () => {
  const { config } = await withAdapter(null, () => eliminarTemarioRequest('temario-1'));

  assert.equal(config.method, 'delete');
  assert.equal(config.url, '/temarios/temario-1');
});

test('estadísticas devuelve el contador real de llamadas IA', async () => {
  const { result, config } = await withAdapter({ llamadasIA: 7 }, getTemarioStats);

  assert.equal(config.method, 'get');
  assert.equal(config.url, '/temarios/estadisticas');
  assert.equal(result.llamadasIA, 7);
});

test('edición usa el contrato existente completo del temario', async () => {
  const actualizado = { ...temario, titulo: 'Álgebra actualizada' };
  const { result, config } = await withAdapter(actualizado, () => actualizarTemarioRequest('temario-1', actualizado));

  assert.equal(config.method, 'put');
  assert.equal(config.url, '/temarios/temario-1');
  assert.deepEqual(JSON.parse(config.data), {
    titulo: actualizado.titulo,
    descripcion: actualizado.descripcion,
    gradoAcademico: actualizado.gradoAcademico,
    asignatura: actualizado.asignatura
  });
  assert.deepEqual(result, actualizado);
});

test('Dashboard solo confirma edición cuando el store responde éxito', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');

  assert.match(storeSource, /updateTemario: async/);
  assert.match(dashboardSource, /result\.success/);
});
