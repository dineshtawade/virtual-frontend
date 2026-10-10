import axiosClient from '../api/axiosClient';

export const propertyService = {
  getProperties: async () => {
    return await axiosClient.get('/properties');
  },

  createProperty: async (propertyData) => {
    return await axiosClient.post('/properties', propertyData);
  },

  updateProperty: async (id, propertyData) => {
    return await axiosClient.put(`/properties/${id}`, propertyData);
  },

  deleteProperty: async (id) => {
    return await axiosClient.delete(`/properties/${id}`);
  },

  unlockContact: async (propertyId) => {
    return await axiosClient.post(`/properties/${propertyId}/unlock`);
  },
};
