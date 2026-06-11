import api from './api';

/**
 * Static/Mock credentials for prototype phase.
 * In a real environment, these will be validated by the database/backend.
 */
const MOCK_USER = {
  id: 'usr-8f7b-482a-bc91-2244bb66cc88',
  email: 'admin@katedra.com',
  nombre: 'Prof. Alejandro',
  rol: 'Docente Premium',
  avatarInitials: 'PA'
};

const MOCK_PASSWORD = 'admin123';

/**
 * Simulates an authentication request with an artificial delay.
 * Fully prepared for backend REST integration.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>}
 */
export const loginRequest = async (email, password) => {
  // Option 1: Backend Integration (Pre-integrated, just uncomment when ready)
  /*
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Expected format: { user: { id, email, nombre, ... }, token: "jwt_token" }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de autenticación');
  }
  */

  // Option 2: Static Prototype Implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.toLowerCase() === MOCK_USER.email && password === MOCK_PASSWORD) {
        // Return dummy token along with user details
        resolve({
          user: MOCK_USER,
          token: 'mock-jwt-token-xyz-12345'
        });
      } else {
        reject(new Error('Credenciales incorrectas. Pruebe con admin@katedra.com y admin123.'));
      }
    }, 800); // 800ms natural delay
  });
};

/**
 * Simulates a logout request.
 * Can be integrated with token revocation endpoints if needed.
 */
export const logoutRequest = async () => {
  // Option 1: Backend Integration
  /*
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error on backend:', error);
  }
  */

  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 200);
  });
};
