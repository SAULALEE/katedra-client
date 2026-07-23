import api from './api.js';

export const getAsignaturas = async () => {
  try {
    const response = await api.get('/asignaturas');
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener asignaturas', { cause: error });
  }
};

export const getAsignatura = async (id) => {
  try {
    const response = await api.get(`/asignaturas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener la asignatura', { cause: error });
  }
};

export const crearAsignaturaRequest = async ({ nombre, descripcion }) => {
  try {
    const response = await api.post('/asignaturas', { nombre, descripcion });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al crear la asignatura', { cause: error });
  }
};

export const eliminarAsignaturaRequest = async (id) => {
  try {
    await api.delete(`/asignaturas/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al eliminar la asignatura', { cause: error });
  }
};
