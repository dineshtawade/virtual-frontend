import axiosClient from '../api/axiosClient';

export const adminService = {
  getAdminStats: async () => {
    return await axiosClient.get('/admin/stats');
  },

  getAllUsers: async () => {
    return await axiosClient.get('/admin/users');
  },

  resetSystem: async () => {
    return await axiosClient.post('/admin/reset');
  },

  getSettings: async () => {
    return await axiosClient.get('/admin/settings');
  },

  updateSettings: async (settingsData) => {
    return await axiosClient.put('/admin/settings', settingsData);
  },

  testEmail: async (targetEmail) => {
    return await axiosClient.post('/admin/settings/test-email', { targetEmail });
  },
};
