import { createSlice } from '@reduxjs/toolkit';

const emulatorSlice = createSlice({
  name: 'emulator',
  initialState: {
    activeTab: 'owner_subscription', // 'owner_subscription' | 'addons'
    selectedListing: null,
    photoModalOpen: false,
    selectedPhoto: null,
    actionLogs: [],
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedListing: (state, action) => {
      state.selectedListing = action.payload;
    },
    setPhotoModalOpen: (state, action) => {
      state.photoModalOpen = action.payload.open;
      if (action.payload.photo) state.selectedPhoto = action.payload.photo;
    },
    setActionLogs: (state, action) => {
      state.actionLogs = action.payload;
    },
    addLogEntry: (state, action) => {
      state.actionLogs.unshift(action.payload);
      if (state.actionLogs.length > 100) state.actionLogs.pop();
    },
  },
});

export const { setActiveTab, setSelectedListing, setPhotoModalOpen, setActionLogs, addLogEntry } = emulatorSlice.actions;
export default emulatorSlice.reducer;
