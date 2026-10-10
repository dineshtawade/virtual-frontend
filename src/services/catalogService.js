import axiosClient from '../api/axiosClient';

export const catalogService = {
  getCatalog: async () => {
    return await axiosClient.get('/catalog');
  },

  updateCatalogFlags: async (flags) => {
    return await axiosClient.put('/catalog/flags', flags);
  },

  updateAccessMatrix: async (matrix) => {
    return await axiosClient.put('/catalog/access-matrix', matrix);
  },

  upsertPlan: async (plan) => {
    return await axiosClient.post('/catalog/plan', plan);
  },
};
