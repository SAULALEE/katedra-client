import api from './api';

const normalizeUser = (user) => ({
  ...user,
  rol: user.rol || user.role || 'ROLE_PROFESOR',
  fechaRegistro: user.fechaRegistro || user.createdAt || null,
  estado: user.estado || null
});

/**
 * Fetches all users from the backend API.
 *
 * @returns {Promise<Array>} List of users
 */
export const getUsersRequest = async () => {
  try {
    const response = await api.get('/usuarios');
    const users = Array.isArray(response.data) ? response.data : [];
    return users.map(normalizeUser);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};

/**
 * Creates a new administrator account in the backend API. This endpoint only
 * creates ROLE_ADMIN accounts; teachers self-register via /auth/register.
 *
 * @param {object} userData Data for the new admin ({ nombre, email })
 * @returns {Promise<{user: object, temporaryPassword: string}>} Created user and its one-time temporary password
 */
export const createUserRequest = async (userData) => {
  try {
    const response = await api.post('/usuarios', {
      nombre: userData.nombre,
      email: userData.email
    });
    return {
      user: normalizeUser(response.data.usuario),
      temporaryPassword: response.data.temporaryPassword
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
};

/**
 * Updates an existing user in the backend API.
 *
 * @param {string} id User UUID
 * @param {object} userData User data to update
 * @returns {Promise<object>} Updated user
 */
export const updateUserRequest = async (id, userData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return normalizeUser(response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
  }
};

/**
 * Deletes an existing user from the backend API.
 *
 * @param {string} id User UUID
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteUserRequest = async (id) => {
  try {
    await api.delete(`/usuarios/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
  }
};
