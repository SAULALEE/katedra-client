import { create } from 'zustand';
import {
  crearAsignaturaRequest,
  eliminarAsignaturaRequest,
  getAsignaturas
} from '../services/asignaturaService';

export const useAsignaturaStore = create((set) => ({
  asignaturas: [],
  loading: false,
  error: null,

  fetchAsignaturas: async () => {
    set({ loading: true, error: null });
    try {
      const asignaturas = await getAsignaturas();
      set({ asignaturas, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.message || 'Error al obtener asignaturas';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  crearAsignatura: async (payload) => {
    set({ loading: true, error: null });
    try {
      const nuevaAsignatura = await crearAsignaturaRequest(payload);
      const asignaturas = await getAsignaturas();
      set({ asignaturas, loading: false });
      return { success: true, asignatura: nuevaAsignatura };
    } catch (error) {
      const message = error.message || 'Error al crear la asignatura';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  eliminarAsignatura: async (id) => {
    set({ loading: true, error: null });
    try {
      await eliminarAsignaturaRequest(id);
      set((state) => ({
        asignaturas: state.asignaturas.filter((asignatura) => asignatura.id !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.message || 'Error al eliminar la asignatura';
      const status = error.cause?.response?.status;
      set({ error: message, loading: false });
      return { success: false, error: message, status };
    }
  }
}));
