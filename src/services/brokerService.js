import axiosClient from '../api/axiosClient';

export const brokerService = {
  getBrokerState: async () => {
    return await axiosClient.get('/broker/state');
  },

  updateBrokerState: async (payload) => {
    return await axiosClient.put('/broker/state', payload);
  },

  setSimulatedClock: async (simulatedTime) => {
    return await axiosClient.post('/broker/clock', { simulatedTime });
  },

  applyPreset: async (presetId) => {
    return await axiosClient.post(`/broker/preset/${presetId}`);
  },
};
