import axios from 'axios';

// Base API configuration for potential backend integration
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Authenticates user with email and password using the real backend API.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Returns mapped user details and the JWT token.
 */
export const loginRequest = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // Parse backend response data
    const { token, id, email: responseEmail, usuario } = response.data;
    
    // Generate avatar initials from usuario's name
    const avatarInitials = usuario?.nombre
      ? usuario.nombre.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    return {
      user: {
        id,
        email: responseEmail,
        nombre: usuario?.nombre || 'Usuario Katedra',
        rol: usuario?.rol || 'ROLE_USER',
        avatarInitials
      },
      token
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || 'Error de autenticación. Por favor, compruebe sus credenciales.';
    throw new Error(errorMessage, { cause: error });
  }
};

/**
 * Performs a logout request on the backend if configured, and returns true.
 * 
 * @returns {Promise<boolean>}
 */
export const logoutRequest = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Backend logout endpoint failed or not active:', error);
  }
  return true;
};
