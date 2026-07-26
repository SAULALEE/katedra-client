import { create } from 'zustand';
import { createUserRequest, deleteUserRequest, getUsersRequest, updateUserRequest } from '../services/userService';

export const useUserStore = create((set) => ({
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
   * Action to create a new admin user. Returns the created user and its
   * one-time temporary password, or null on failure.
   */
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { user, temporaryPassword } = await createUserRequest(userData);
      set((state) => ({
        users: [user, ...state.users],
        loading: false,
        error: null
      }));
      return { user, temporaryPassword };
    } catch (err) {
      set({ error: err.message || 'Error al crear usuario', loading: false });
      return null;
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
  },

  /**
   * Action to delete an existing user.
   */
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteUserRequest(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
        error: null
      }));
      return true;
    } catch (err) {
      set({ error: err.message || 'Error al eliminar usuario', loading: false });
      return false;
    }
  }
}));
