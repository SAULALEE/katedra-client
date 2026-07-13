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
 * Selectively generates material pieces for an existing temario.
 * Takes 10-30 seconds per piece (real AI generation, not instant).
 * Pieces that already exist are skipped by the backend unless listed
 * in regenerarPiezas (credit-safe), and reported in piezasOmitidas.
 *
 * @param {string} id - the temario UUID
 * @param {object} options
 * @param {string[]} options.piezas - subset of ['teoria','ejercicios','evaluacion','diapositivas']
 * @param {string} options.modelo - 'gpt-4o-mini' (Sencillo) | 'gpt-4o' (Avanzado)
 * @param {string[]} [options.regenerarPiezas] - pieces allowed to overwrite existing content
 */
export const generarMaterialParaTemario = async (id, { piezas, modelo, regenerarPiezas = [] }) => {
  try {
    const response = await api.post(`/temarios/${id}/generar-material`, { piezas, modelo, regenerarPiezas });
    return response.data;
  } catch (error) {
    throw new Error('Error al generar material con IA', { cause: error });
  }
};

export const getContenidoTemario = async (id) => {
  try {
    const response = await api.get(`/temarios/${id}/contenido`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el contenido del temario', { cause: error });
  }
};
