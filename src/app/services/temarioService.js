import api from './api.js';
import { nombreDesdeContentDisposition } from '../utils/descargarArchivo.js';
import { EXTENSION_POR_FORMATO } from '../utils/exportOptions.js';


/**
 * Fetches all courses/temarios.
 * Restores from localStorage if available to support mockup persistence.
 */
export const getTemarios = async (asignaturaId) => {
  try {
    const response = await api.get('/temarios', asignaturaId ? { params: { asignaturaId } } : undefined);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener temarios', { cause: error });
  }
};

/**
 * Adds a new temario to the system (supporting links, files, etc.).
 * Fully prepared for backend ingestion.
 * 
 * @param {object} temarioData { titulo, asignaturaId, gradoAcademico, modelo, descripcion, numeroModulos, origen, detalleOrigen }
 */
export const crearTemarioRequest = async (temarioData) => {
  try {
    const { titulo, descripcion, gradoAcademico, asignaturaId, modelo, numeroModulos } = temarioData;
    const response = await api.post('/temarios', { titulo, descripcion, gradoAcademico, asignaturaId, modeloGeneracion: modelo, numeroModulos });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al guardar el temario', { cause: error });
  }
};

export const getTemariosFavoritos = async () => {
  try {
    const response = await api.get('/temarios/favoritos');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al obtener favoritos', { cause: error });
  }
};

export const actualizarFavoritoTemario = async (id, favorito) => {
  try {
    const response = await api.patch(`/temarios/${id}/favorito`, { favorito });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al actualizar favorito', { cause: error });
  }
};

export const getTemarioStats = async () => {
  try {
    const response = await api.get('/temarios/estadisticas');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener estadísticas de temarios', { cause: error });
  }
};

/**
 * Fetches the authenticated user's read-only content history (temarios created, edited,
 * (un)favorited, had material generated, or deleted), newest first.
 */
export const getHistorial = async () => {
  try {
    const response = await api.get('/temarios/historial');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el historial de contenidos', { cause: error });
  }
};

export const eliminarTemarioRequest = async (id) => {
  try {
    await api.delete(`/temarios/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el temario', { cause: error });
  }
};

export const actualizarTemarioRequest = async (id, temarioData) => {
  try {
    const { titulo, descripcion, gradoAcademico, asignaturaId } = temarioData;
    const response = await api.put(`/temarios/${id}`, { titulo, descripcion, gradoAcademico, asignaturaId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el temario', { cause: error });
  }
};
export const cargarTemarioArchivoRequest = async ({ file, titulo, asignaturaId, gradoAcademico, modelo, numeroModulos }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titulo', titulo);
    formData.append('asignaturaId', asignaturaId);
    formData.append('gradoAcademico', gradoAcademico);
    formData.append('modeloGeneracion', modelo);
    if (numeroModulos != null) formData.append('numeroModulos', numeroModulos);

    const response = await api.post('/temarios/cargar/archivo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.temario || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al cargar el archivo del temario', { cause: error });
  }
};

export const cargarTemarioUrlRequest = async ({ url, titulo, asignaturaId, gradoAcademico, modelo, numeroModulos }) => {
  try {
    const response = await api.post('/temarios/cargar/url', { url, titulo, asignaturaId, gradoAcademico, modeloGeneracion: modelo, numeroModulos });
    return response.data.temario || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al cargar el temario desde URL', { cause: error });
  }
};

/**
 * Generates material pieces for an existing temario, always overwriting any
 * previous content for the requested pieces. Takes 10-30 seconds per piece
 * (real AI generation, not instant).
 *
 * A 200 response can still carry partial failures: check `piezasFallidas`
 * (a { [piezaId]: mensaje } map) for pieces whose generation failed — those
 * keep their previous content rather than being overwritten with an error.
 *
 * @param {string} id - the temario UUID
 * @param {object} options
 * @param {string[]} options.piezas - subset of ['teoria','evaluacion','diapositivas']
 * @param {string} options.modelo - 'flash' | 'pro'
 * @param {number} [options.numeroDiapositivas] - within the selected tier's range; omitted/undefined uses the tier default
 * @param {number} [options.numeroParrafos] - within the selected tier's range; omitted/undefined uses the tier default
 * @param {number} [options.numeroPreguntas] - within the selected tier's range; omitted/undefined uses the tier default
 */
export const generarMaterialParaTemario = async (
  id, { piezas, modelo, numeroDiapositivas, numeroParrafos, numeroPreguntas }
) => {
  try {
    const response = await api.post(`/temarios/${id}/generar-material`, {
      piezas, modelo, numeroDiapositivas, numeroParrafos, numeroPreguntas
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al generar material con IA', { cause: error });
  }
};

/**
 * @typedef {Object} ContenidoTemarioResponseDTO
 * @property {string} [teoria]
 * @property {object[]} [evaluacion]
 * @property {object[]} [diapositivas]
 */

/**
 * @returns {Promise<ContenidoTemarioResponseDTO>}
 */
export const getContenidoTemario = async (id) => {
  try {
    const response = await api.get(`/temarios/${id}/contenido`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el contenido del temario', { cause: error });
  }
};

export const getFuenteTemario = async (id) => {
  try {
    const response = await api.get(`/temarios/${id}/fuente`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al obtener el contenido fuente', { cause: error });
  }
};

/**
 * With responseType 'blob' the ERROR body is a Blob too, so `error.response.data.message` is
 * undefined and the user would see "undefined" in the toast. Read the blob back as JSON.
 */
const leerMensajeDeErrorBlob = async (error) => {
  const data = error?.response?.data;
  if (!(data instanceof Blob)) {
    return data?.message || data?.error || null;
  }
  try {
    return JSON.parse(await data.text())?.message || null;
  } catch {
    return null;
  }
};

/**
 * Downloads a generated material piece as a file.
 *
 * @param {string} id - the temario UUID
 * @param {'teoria'|'evaluacion'|'diapositivas'} pieza
 * @param {'docx'|'pdf'|'md'|'pptx'|'gs'} formato
 * @param {'light'|'dark'} [theme] - matches the app's current theme so slide exports look like a
 *   continuation of what the teacher was looking at, not a fixed style
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export const exportarMaterialTemario = async (id, pieza, formato, theme) => {
  try {
    const params = { pieza, formato };
    if (theme) params.theme = theme;

    const response = await api.get(`/temarios/${id}/exportaciones`, {
      params,
      responseType: 'blob',
      // The axios instance has no default timeout (0 = wait forever), which would leave the
      // export spinner running indefinitely if the backend hangs.
      timeout: 60000
    });

    return {
      blob: response.data,
      filename: nombreDesdeContentDisposition(response.headers['content-disposition'])
        || `${pieza}.${EXTENSION_POR_FORMATO[formato] || formato}`
    };
  } catch (error) {
    const mensaje = error?.code === 'ECONNABORTED'
      ? 'La exportación tardó demasiado. Intenta de nuevo.'
      : await leerMensajeDeErrorBlob(error);
    throw new Error(mensaje || 'No se pudo exportar el material', { cause: error });
  }
};
