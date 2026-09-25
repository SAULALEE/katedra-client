/**
 * Translates a technical backend role code to a user-friendly display string.
 * 
 * @param {string} roleCode The raw role code from the backend (e.g. ROLE_ADMIN).
 * @returns {string} The translated display name (e.g. Administrador).
 */
export const isAdmin = (user) => {
  if (!user) {
    return false;
  }

  if (user.rol === 'ROLE_ADMIN') {
    return true;
  }

  if (Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN')) {
    return true;
  }

  return false;
};

export const isProfesor = (user) => {
  return user?.rol === 'ROLE_PROFESOR' || (Array.isArray(user?.roles) && user.roles.includes('ROLE_PROFESOR'));
};

export const getDefaultRoute = (user) => {
  if (isAdmin(user)) return '/usuarios';
  if (isProfesor(user)) return '/dashboard';
  if (user?.rol === 'ROLE_ALUMNO') return '/alumnos/mi-cuenta';
  return '/alumnos';
};

export const formatRoleDisplay = (roleCode) => {
  const roleMap = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_PROFESOR': 'Profesor',
    'ROLE_ALUMNO': 'Alumno'
  };
  return roleMap[roleCode] || 'Profesor';
};

