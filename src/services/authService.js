import axiosClient from '../api/axiosClient';

export const authService = {
  register: async (payload) => {
    return await axiosClient.post('/auth/register', payload);
  },

  login: async (email, password) => {
    return await axiosClient.post('/auth/login', { email, password });
  },

  getProfile: async () => {
    return await axiosClient.get('/auth/me');
  },
};
