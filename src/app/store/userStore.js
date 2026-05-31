import { create } from 'zustand';
import { getUsersRequest, createUserRequest, updateUserRequest } from '../services/userService';

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  /**
   * Action to fetch users from the service layer.
   */
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getUsersRequest();
      set({ users: data, loading: false, error: null });
    } catch (err) {
      set({ error: err.message || 'Error al cargar usuarios', loading: false });
    }
  },

  /**
   * Action to create a new user.
   */
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const newUser = await createUserRequest(userData);
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
        error: null
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al crear usuario', loading: false });
      return false;
    }
  },

  /**
   * Action to update an existing user.
   */
  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await updateUserRequest(id, userData);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        loading: false,
        error: null
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al actualizar usuario', loading: false });
      return false;
    }
  }
}));
