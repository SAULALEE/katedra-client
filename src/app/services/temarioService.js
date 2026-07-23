import api from './api.js';


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
 * @param {object} temarioData { titulo, asignaturaId, gradoAcademico, modelo, descripcion, temas, origen, detalleOrigen }
 */
export const crearTemarioRequest = async (temarioData) => {
  try {
    const { titulo, descripcion, gradoAcademico, asignaturaId, modelo } = temarioData;
    const response = await api.post('/temarios', { titulo, descripcion, gradoAcademico, asignaturaId, modelo });
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
export const cargarTemarioArchivoRequest = async ({ file, titulo, asignaturaId, gradoAcademico, modelo }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titulo', titulo);
    formData.append('asignaturaId', asignaturaId);
    formData.append('gradoAcademico', gradoAcademico);
    formData.append('modelo', modelo);

    const response = await api.post('/temarios/cargar/archivo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.temario || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al cargar el archivo del temario', { cause: error });
  }
};

export const cargarTemarioUrlRequest = async ({ url, titulo, asignaturaId, gradoAcademico, modelo }) => {
  try {
    const response = await api.post('/temarios/cargar/url', { url, titulo, asignaturaId, gradoAcademico, modelo });
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
 * @param {string} options.modelo - 'basico' | 'avanzado'
 */
export const generarMaterialParaTemario = async (id, { piezas, modelo }) => {
  try {
    const response = await api.post(`/temarios/${id}/generar-material`, { piezas, modelo });
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
 * Sends a message to the AI assistant with an optional quick action.
 *
 * Corrections always run on the backend's fast tier (never a reasoning model) so every
 * response stays within its 10s budget — there is no model choice for this endpoint.
 *
 * @param {object} params
 * @param {string} params.temarioId - the selected temario UUID
 * @param {string} params.action - AssistantQuickAction: 'ACORTAR' | 'EXTENDER' | 'SIMPLIFICAR' | 'AGREGAR_EJEMPLO' | 'CORREGIR_REDACCION' | 'FREE_CHAT'
 * @param {string} params.message - user text prompt
 */
export const enviarMensajeAsistente = async ({ temarioId, action, message }) => {
  try {
    const response = await api.post('/assistant/chat', { temarioId, action, message });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message, { cause: error });
    }
    throw new Error('Error al hablar con el asistente', { cause: error });
  }
};

