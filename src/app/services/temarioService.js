import api from './api';


/**
 * Fetches all courses/temarios.
 * Restores from localStorage if available to support mockup persistence.
 */
export const getTemarios = async () => {
  try {
    const response = await api.get('/temarios');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener temarios', { cause: error });
  }
};

/**
 * Adds a new temario to the system (supporting links, drive, pdfs, etc.).
 * Fully prepared for backend ingestion.
 * 
 * @param {object} temarioData { titulo, asignatura, gradoAcademico, descripcion, temas, origen, detalleOrigen }
 */
export const crearTemarioRequest = async (temarioData) => {
  try {
    const response = await api.post('/temarios', temarioData);
    return response.data;
  } catch (error) {
    throw new Error('Error al guardar el temario', { cause: error });
  }
};
export const cargarTemarioArchivoRequest = async ({ file, titulo, asignatura, gradoAcademico }) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titulo', titulo);
    formData.append('asignatura', asignatura);
    formData.append('gradoAcademico', gradoAcademico);

    const response = await api.post('/temarios/cargar/archivo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar el archivo del temario', { cause: error });
  }
};

export const cargarTemarioUrlRequest = async ({ url, titulo, asignatura, gradoAcademico }) => {
  try {
    const response = await api.post('/temarios/cargar/url', { url, titulo, asignatura, gradoAcademico });
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar el temario desde URL', { cause: error });
  }
};

export const cargarTemarioDriveRequest = async ({ url, titulo, asignatura, gradoAcademico }) => {
  try {
    const response = await api.post('/temarios/cargar/drive', { url, titulo, asignatura, gradoAcademico });
    return response.data;
  } catch (error) {
    throw new Error('Error al cargar el temario desde Drive', { cause: error });
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
 * @param {string} options.modelo - 'flash' (Tutor) | 'pro' (Maestro) | 'max' (Catedrático)
 */
export const generarMaterialParaTemario = async (id, { piezas, modelo }) => {
  try {
    const response = await api.post(`/temarios/${id}/generar-material`, { piezas, modelo });
    return response.data;
  } catch (error) {
    throw new Error('Error al generar material con IA', { cause: error });
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

