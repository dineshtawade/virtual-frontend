import axiosClient from '../api/axiosClient';

export const emulatorService = {
  executeAction: async (actionType, payload = {}) => {
    return await axiosClient.post('/emulator/action', { actionType, payload });
  },

  getActionLogs: async () => {
    return await axiosClient.get('/emulator/logs');
  },

  clearActionLogs: async () => {
    return await axiosClient.delete('/emulator/logs');
  },
};
