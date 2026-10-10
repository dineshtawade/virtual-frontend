import { createSlice } from '@reduxjs/toolkit';

const clockSlice = createSlice({
  name: 'clock',
  initialState: {
    simulatedTime: new Date().toISOString(),
    isLive: false,
  },
  reducers: {
    setSimulatedTime: (state, action) => {
      state.simulatedTime = action.payload;
    },
    advanceDays: (state, action) => {
      const days = action.payload || 1;
      const current = new Date(state.simulatedTime);
      current.setDate(current.getDate() + days);
      state.simulatedTime = current.toISOString();
    },
  },
});

export const { setSimulatedTime, advanceDays } = clockSlice.actions;
export default clockSlice.reducer;
