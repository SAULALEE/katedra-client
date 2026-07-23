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
  getTemarios,
  actualizarTemarioRequest,
  getTemariosFavoritos,
  actualizarFavoritoTemario
} from './temarioService.js';

globalThis.localStorage = {
  getItem: () => null
};

const temario = {
  id: 'temario-1',
  asignaturaId: 'asignatura-1',
  titulo: 'Álgebra',
  descripcion: 'Curso manual',
  gradoAcademico: 'Primaria',
  asignatura: 'Matemáticas',
  modelo: 'BASICO'
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

test('obtiene únicamente los temarios de la asignatura seleccionada', async () => {
  const { result, config } = await withAdapter([temario], () => getTemarios('asignatura-1'));

  assert.equal(config.url, '/temarios');
  assert.deepEqual(config.params, { asignaturaId: 'asignatura-1' });
  assert.deepEqual(result, [temario]);
});

test('obtiene el contenido fuente de un temario', async () => {
  const serviceSource = await readFile(new URL('./temarioService.js', import.meta.url), 'utf8');

  assert.match(serviceSource, /export const getFuenteTemario = async \(id\)/);
  assert.match(serviceSource, /api\.get\(`\/temarios\/\$\{id\}\/fuente`\)/);
});

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
    asignaturaId: temario.asignaturaId,
    modeloGeneracion: temario.modelo
  });
  assert.deepEqual(result, temario);
});

test('carga por archivo envía multipart y devuelve el temario creado', async () => {
  const uploadResponse = { temario, contenidoId: 'contenido-1', archivoNombre: 'temario.md' };
  const file = new File(['# Temario'], 'temario.md', { type: 'text/markdown' });
  const { result, config } = await withAdapter(uploadResponse, () => cargarTemarioArchivoRequest({
    file,
    titulo: temario.titulo,
    asignaturaId: temario.asignaturaId,
    gradoAcademico: temario.gradoAcademico,
    modelo: temario.modelo
  }));

  assert.equal(config.url, '/temarios/cargar/archivo');
  assert.equal(config.data.get('file'), file);
  assert.equal(config.data.get('titulo'), temario.titulo);
  assert.equal(config.data.get('asignaturaId'), temario.asignaturaId);
  assert.equal(config.data.get('asignatura'), null);
  assert.equal(config.data.get('gradoAcademico'), temario.gradoAcademico);
  assert.equal(config.data.get('modeloGeneracion'), temario.modelo);
  assert.equal(config.data.get('modelo'), null);
  assert.deepEqual(result, temario);
});

test('carga por URL envía el contrato exacto y devuelve el temario creado', async () => {
  const uploadResponse = { temario, contenidoId: 'contenido-2', fuenteUrl: 'https://example.com/temario' };
  const payload = {
    url: uploadResponse.fuenteUrl,
    titulo: temario.titulo,
    asignaturaId: temario.asignaturaId,
    gradoAcademico: temario.gradoAcademico,
    modelo: temario.modelo
  };
  const { result, config } = await withAdapter(uploadResponse, () => cargarTemarioUrlRequest(payload));

  assert.equal(config.url, '/temarios/cargar/url');
  const { modelo, ...rest } = payload;
  assert.deepEqual(JSON.parse(config.data), { ...rest, modeloGeneracion: modelo });
  assert.deepEqual(result, temario);
});

test('generación envía los modelos flash y pro junto con los conteos seleccionados', async () => {
  for (const modelo of ['flash', 'pro']) {
    const contenido = { id: 'contenido-1', modelo, piezasFallidas: {} };
    const { result, config } = await withAdapter(contenido, () => generarMaterialParaTemario('temario-1', {
      piezas: ['teoria', 'evaluacion', 'diapositivas'],
      modelo,
      numeroDiapositivas: 8,
      numeroParrafos: 10,
      numeroPreguntas: 5
    }));

    assert.equal(config.url, '/temarios/temario-1/generar-material');
    assert.deepEqual(JSON.parse(config.data), {
      piezas: ['teoria', 'evaluacion', 'diapositivas'],
      modelo,
      numeroDiapositivas: 8,
      numeroParrafos: 10,
      numeroPreguntas: 5
    });
    assert.deepEqual(result, contenido);
  }
});

test('selector de generación ofrece únicamente Tutor (flash) y Catedrático (pro)', async () => {
  const source = await readFile(new URL('../hooks/useGenerator.js', import.meta.url), 'utf8');
  const modelosSource = source.slice(source.indexOf('export const MODELOS'), source.indexOf('export const MODELO_LABELS'));

  assert.match(modelosSource, /id: 'flash', label: 'Tutor'/);
  assert.match(modelosSource, /id: 'pro', label: 'Catedrático'/);
  assert.doesNotMatch(modelosSource, /id: '(basico|avanzado|max)'/);
});

test('selector de archivo acepta PDF, DOC, DOCX y Markdown', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  assert.match(source, /accept="\.pdf,\.doc,\.docx,\.md"/);
});

test('formulario permite seleccionar un solo grado académico', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(source, /<select value=\{gradoSeleccionado\}/);
  assert.doesNotMatch(source, /gradosSeleccionados|toggleGrado/);
});

test('formulario envía BASICO o AVANZADO en los tres métodos', async () => {
  const source = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(source, /useState\('BASICO'\)/);
  assert.match(source, /value:'BASICO', label:'Básico'/);
  assert.match(source, /value:'AVANZADO', label:'Avanzado'/);
  assert.match(source, /cargarTemario\('archivo', \{[^}]*modelo/s);
  assert.match(source, /cargarTemario\('url', \{[^}]*modelo/s);
  assert.match(source, /const payload = \{[^}]*modelo/s);
});

test('carga de temarios ofrece únicamente Archivo, URL y Manual', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');
  const serviceSource = await readFile(new URL('./temarioService.js', import.meta.url), 'utf8');

  assert.match(dashboardSource, /data-tab-opt="file"/);
  assert.match(dashboardSource, /data-tab-opt="web"/);
  assert.match(dashboardSource, /data-tab-opt="manual"/);
  assert.doesNotMatch(dashboardSource, /drive/i);
  assert.doesNotMatch(storeSource, /drive/i);
  assert.doesNotMatch(serviceSource, /drive/i);
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
        asignaturaId: temario.asignaturaId,
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

test('Peticiones IA carga y refresca llamadasIA sin incrementos optimistas', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const hookSource = await readFile(new URL('../hooks/useTemarios.js', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');

  assert.match(storeSource, /const stats = await getTemarioStats\(\);\s*set\(\{ aiCalls: stats\.llamadasIA \}\)/);
  assert.match(hookSource, /useEffect\(\(\) => \{\s*fetchStats\(\);/);
  assert.match(hookSource, /refetchStats: fetchStats/);
  assert.match(dashboardSource, /Peticiones IA/);
  assert.match(dashboardSource, /\{aiCalls\}/);
  assert.match(dashboardSource, /if \(result\.success\) \{\s*await Promise\.all\(\[\s*refetchStats\(\),/);
  assert.doesNotMatch(dashboardSource, /setAiCalls|aiCalls\s*\+\s*1/);
});

test('Dashboard conserva Materiales y Peticiones IA sin Tiempo Ahorrado', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, />Materiales</);
  assert.match(dashboardSource, />Peticiones IA</);
  assert.doesNotMatch(dashboardSource, /Tiempo Ahorrado|38\.4|30% por temario/);
});

test('edición usa asignaturaId en el contrato del temario', async () => {
  const actualizado = { ...temario, titulo: 'Álgebra actualizada' };
  const { result, config } = await withAdapter(actualizado, () => actualizarTemarioRequest('temario-1', actualizado));

  assert.equal(config.method, 'put');
  assert.equal(config.url, '/temarios/temario-1');
  assert.deepEqual(JSON.parse(config.data), {
    titulo: actualizado.titulo,
    descripcion: actualizado.descripcion,
    gradoAcademico: actualizado.gradoAcademico,
    asignaturaId: actualizado.asignaturaId
  });
  assert.deepEqual(result, actualizado);
});

test('Cargar Temario selecciona y crea asignaturas sin usar un campo manual', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, /select value=\{asignaturaId\}/);
  assert.match(dashboardSource, /\+ Crear asignatura/);
  assert.match(dashboardSource, /setAsignaturaId\(result\.asignatura\.id\)/);
  assert.match(dashboardSource, /Debes crear una asignatura/);
  assert.doesNotMatch(dashboardSource, /setAsignatura\('Documento Educativo'\)/);
});

test('Cargar Temario impide el envío sin asignaturaId', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, /if \(!asignaturaId\)/);
  assert.match(dashboardSource, /Selecciona o crea una asignatura/);
});

test('Dashboard solo confirma edición cuando el store responde éxito', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');

  assert.match(storeSource, /updateTemario: async/);
  assert.match(dashboardSource, /result\.success/);
});

test('Dashboard separa el encabezado y acción de asignaturas y temarios', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, /vistaFavoritos \? 'Favoritos' : asignaturaSeleccionada \? 'Mis Temarios' : 'Mis Asignaturas'/);
  assert.match(dashboardSource, /vistaFavoritos \? 'Tus temarios favoritos' : asignaturaSeleccionada \? 'Temarios de la asignatura' : 'Administra tus asignaturas'/);
  assert.match(dashboardSource, /asignaturaSeleccionada && \(\s*<button className="kt-primary"/);
  assert.match(dashboardSource, /!mostrandoTemarios && \(\s*<button className="kt-primary"/);
});

test('Dashboard vuelve a consultar los temarios filtrados después de crear', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(
    dashboardSource,
    /if \(result\.success\) \{\s*await Promise\.all\(\[\s*refetchStats\(\),\s*fetchCoursesByAsignatura\(asignaturaActiva\.id\)\s*\]\)/
  );
  assert.doesNotMatch(dashboardSource, /assignmentCourses:\s*\[\.\.\./);
});

test('Abrir ofrece Contenido y Material conservando la navegación anterior', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, />Contenido</);
  assert.match(dashboardSource, />Material</);
  assert.match(dashboardSource, /handleOpenFuente\(c\)/);
  assert.match(dashboardSource, /navigate\(`\/contenido\/\$\{c\.id\}`\)/);
});

test('Contenido abre un panel lateral con loading, error y cierre', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');

  assert.match(storeSource, /fetchFuenteTemario: async/);
  assert.match(storeSource, /sourceLoading: true/);
  assert.match(storeSource, /sourceError/);
  assert.match(dashboardSource, /contenidoFuente/);
  assert.match(dashboardSource, /Cerrar panel de contenido/);
});

test('panel fuente reutiliza Markdown de Teoría docente y conserva parte del Dashboard visible', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');

  assert.match(dashboardSource, /import ReactMarkdown from 'react-markdown'/);
  assert.match(dashboardSource, /import remarkGfm from 'remark-gfm'/);
  assert.match(dashboardSource, /<ReactMarkdown remarkPlugins=\{\[remarkGfm\]\}>/);
  assert.match(dashboardSource, /width:'min\(620px,calc\(100% - 48px\)\)'/);
  assert.match(dashboardSource, /\.markdown-body h1/);
  assert.doesNotMatch(dashboardSource, /whiteSpace:'pre-wrap'/);
});

test('consulta todos los temarios favoritos del profesor', async () => {
  const favorito = { ...temario, favorito: true };
  const { result, config } = await withAdapter([favorito], () => getTemariosFavoritos());

  assert.equal(config.method, 'get');
  assert.equal(config.url, '/temarios/favoritos');
  assert.deepEqual(result, [favorito]);
});

test('cambia el favorito mediante PATCH con el contrato exacto', async () => {
  const favorito = { ...temario, favorito: true };
  const { result, config } = await withAdapter(favorito, () => actualizarFavoritoTemario(temario.id, true));

  assert.equal(config.method, 'patch');
  assert.equal(config.url, `/temarios/${temario.id}/favorito`);
  assert.deepEqual(JSON.parse(config.data), { favorito: true });
  assert.deepEqual(result, favorito);
});

test('Favoritos se integra al store, hook y tarjetas existentes', async () => {
  const dashboardSource = await readFile(new URL('../pages/Dashboard.jsx', import.meta.url), 'utf8');
  const storeSource = await readFile(new URL('../store/temarioStore.js', import.meta.url), 'utf8');
  const hookSource = await readFile(new URL('../hooks/useTemarios.js', import.meta.url), 'utf8');

  assert.match(storeSource, /fetchFavoritos: async/);
  assert.match(storeSource, /toggleFavorito: async/);
  assert.match(storeSource, /assignmentCourses: state\.assignmentCourses\.map/);
  assert.match(hookSource, /fetchFavoritos/);
  assert.match(hookSource, /toggleFavorito/);
  assert.match(dashboardSource, /aria-label=\{c\.favorito \? 'Quitar de favoritos' : 'Agregar a favoritos'\}/);
  assert.match(dashboardSource, /no hay temarios favoritos/);
  assert.match(dashboardSource, /handleOpenFavoritos/);
});
