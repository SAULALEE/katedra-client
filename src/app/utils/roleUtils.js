/**
 * Translates a technical backend role code to a user-friendly display string.
 * 
 * @param {string} roleCode The raw role code from the backend (e.g. ROLE_ADMIN).
 * @returns {string} The translated display name (e.g. Administrador).
 */
export const formatRoleDisplay = (roleCode) => {
  const roleMap = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_PROFESOR': 'Profesor',
    'ROLE_USER': 'Usuario Normal'
  };
  return roleMap[roleCode] || 'Usuario';
};
