import { create } from 'zustand';
import {
  getTemarios,
  crearTemarioRequest,
  cargarTemarioArchivoRequest,
  cargarTemarioUrlRequest,
  cargarTemarioDriveRequest,
  eliminarTemarioRequest,
  actualizarTemarioRequest,
  getTemarioStats
} from '../services/temarioService';

export const logActivity = (action, temario, extra = {}) => {
  try {
    const history = JSON.parse(localStorage.getItem('katedra_activity_log') || '[]');
    history.unshift({
      id: 'act_' + Date.now() + Math.random().toString(36).substring(7),
      action, // 'CREADO', 'EDITADO', 'ELIMINADO', 'GENERADO'
      temarioId: temario.id || temario.temarioId || '',
      temarioTitulo: temario.titulo || temario.nombre || 'Temario sin título',
      asignatura: temario.asignatura || temario.curso || 'Materia general',
      createdAt: new Date().toISOString(),
      ...extra
    });
    localStorage.setItem('katedra_activity_log', JSON.stringify(history.slice(0, 200)));
  } catch (e) {
    console.error('Error logging activity:', e);
  }
};

export const useTemarioStore = create((set, get) => ({
  courses: [],
  loading: false,
  error: null,
  aiCalls: 0,

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
      logActivity('CREADO', nuevoTemario);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al crear temario';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  fetchStats: async () => {
    try {
      const stats = await getTemarioStats();
      set({ aiCalls: stats.llamadasIA });
    } catch (err) {
      set({ error: err.message || 'Error al obtener estadísticas' });
    }
  },

  deleteTemario: async (id) => {
    set({ loading: true, error: null });
    try {
      const temarioToDelete = get().courses.find(c => c.id === id) || { id, titulo: 'Temario Eliminado' };
      await eliminarTemarioRequest(id);
      set((state) => ({
        courses: state.courses.filter((course) => course.id !== id),
        loading: false
      }));
      logActivity('ELIMINADO', temarioToDelete);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar temario';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  updateTemario: async (id, temarioData) => {
    set({ loading: true, error: null });
    try {
      const actualizado = await actualizarTemarioRequest(id, temarioData);
      set((state) => ({
        courses: state.courses.map((course) => course.id === id ? actualizado : course),
        loading: false
      }));
      logActivity('EDITADO', actualizado);
      return { success: true, temario: actualizado };
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar temario';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  cargarTemario: async (tipo, temarioData) => {
    set({ loading: true, error: null });
    try {
      const requestMap = {
        archivo: cargarTemarioArchivoRequest,
        url: cargarTemarioUrlRequest,
        drive: cargarTemarioDriveRequest
      };
      const request = requestMap[tipo];
      if (!request) throw new Error('Tipo de carga no soportado');

      const uploadResponse = await request(temarioData);
      const nuevoTemario = uploadResponse.temario || uploadResponse;
      set((state) => ({
        courses: [...state.courses, nuevoTemario],
        loading: false,
        error: null
      }));
      logActivity('CREADO', nuevoTemario, { method: tipo });
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Error al cargar temario';
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  }
}));
