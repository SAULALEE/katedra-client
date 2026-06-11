import axios from 'axios';

// Base API configuration for potential backend integration
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Mock Initial Users for the static prototype
const MOCK_USERS = [
  {
    id: 'usr-0000-0000-0001',
    nombre: 'Saúl Martínez',
    email: 'saul.martinez@katedra.com',
    rol: 'Administrador',
    estado: 'Activo',
    fechaRegistro: '2026-01-10'
  },
  {
    id: 'usr-0000-0000-0002',
    nombre: 'Dra. María Constanza',
    email: 'maria.constanza@katedra.com',
    rol: 'Docente Premium',
    estado: 'Activo',
    fechaRegistro: '2026-02-14'
  },
  {
    id: 'usr-0000-0000-0003',
    nombre: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@katedra.com',
    rol: 'Docente Plan Libre',
    estado: 'Inactivo',
    fechaRegistro: '2026-03-22'
  },
  {
    id: 'usr-0000-0000-0004',
    nombre: 'Mtra. Sofía Altamirano',
    email: 'sofia.alta@katedra.com',
    rol: 'Docente Premium',
    estado: 'Activo',
    fechaRegistro: '2026-05-01'
  }
];

/**
 * Fetches all users from the backend API.
 * Fully prepared for Spring Boot JPA backend integration.
 * 
 * @returns {Promise<Array>} List of users
 */
export const getUsersRequest = async () => {
  // Option 1: Real Backend Integration
  /*
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
  */

  // Option 2: Mock Static Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Retrieve from localStorage to simulate persistence in front-end prototype
      const stored = localStorage.getItem('katedra_mock_users');
      if (stored) {
        resolve(JSON.parse(stored));
      } else {
        localStorage.setItem('katedra_mock_users', JSON.stringify(MOCK_USERS));
        resolve(MOCK_USERS);
      }
    }, 600); // 600ms latency simulation
  });
};

/**
 * Creates a new user in the system.
 * 
 * @param {object} userData DTO user details
 * @returns {Promise<object>} Created user
 */
export const createUserRequest = async (userData) => {
  // Option 1: Real Backend Integration
  /*
  try {
    const response = await api.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
  */

  // Option 2: Mock Static Simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const stored = localStorage.getItem('katedra_mock_users');
      const currentList = stored ? JSON.parse(stored) : MOCK_USERS;
      
      const newUser = {
        ...userData,
        id: `usr-${Math.random().toString(36).substr(2, 9)}`,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      
      const updatedList = [...currentList, newUser];
      localStorage.setItem('katedra_mock_users', JSON.stringify(updatedList));
      resolve(newUser);
    }, 700);
  });
};

/**
 * Updates an existing user details in the system.
 * 
 * @param {string} id User UUID
 * @param {object} userData DTO user updated details
 * @returns {Promise<object>} Updated user
 */
export const updateUserRequest = async (id, userData) => {
  // Option 1: Real Backend Integration
  /*
  try {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
  }
  */

  // Option 2: Mock Static Simulation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const stored = localStorage.getItem('katedra_mock_users');
      const currentList = stored ? JSON.parse(stored) : MOCK_USERS;
      
      const userIndex = currentList.findIndex(u => u.id === id);
      if (userIndex === -1) {
        reject(new Error('Usuario no encontrado'));
        return;
      }
      
      const updatedUser = {
        ...currentList[userIndex],
        ...userData
      };
      
      const updatedList = [...currentList];
      updatedList[userIndex] = updatedUser;
      
      localStorage.setItem('katedra_mock_users', JSON.stringify(updatedList));
      resolve(updatedUser);
    }, 700);
  });
};
