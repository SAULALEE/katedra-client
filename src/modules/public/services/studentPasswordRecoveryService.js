import api from '../../../app/services/api.js';

export const requestStudentPasswordReset = async (email) => {
  await api.post('/auth/password/forgot', { email });
};

export const resetStudentPassword = async (token, newPassword) => {
  await api.post('/auth/password/reset', { token, newPassword });
};
