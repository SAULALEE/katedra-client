import api from '../../../app/services/api.js';

export const getMyStudentProfile = async () => {
  const response = await api.get('/students/me');
  return response.data;
};
