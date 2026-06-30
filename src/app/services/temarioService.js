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

export const generarMaterialAI = async (materia, tema, unidades) => {
  try {
    const response = await api.post('/temarios/generar-material', { materia, tema, unidades });
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
