import { create } from 'zustand';
import { getTemarios, crearTemarioRequest } from '../services/temarioService';

export const useTemarioStore = create((set, get) => ({
  courses: [],
  loading: false,
  error: null,

  /**
   * Fetches courses from the mock / API service.
   */
  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTemarios();
      set({ courses: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Error al obtener temarios', loading: false });
    }
  },

  /**
   * Adds/Processes a new temario.
   */
  crearTemario: async (temarioData) => {
    set({ loading: true, error: null });
    try {
      const nuevoTemario = await crearTemarioRequest(temarioData);
      set((state) => ({
        courses: [...state.courses, nuevoTemario],
        loading: false,
        error: null
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al crear temario', loading: false });
      return false;
    }
  }
}));
