import { configureStore } from '@reduxjs/toolkit';
import brokerReducer from './brokerSlice';
import clockReducer from './clockSlice';
import emulatorReducer from './emulatorSlice';

export const store = configureStore({
  reducer: {
    broker: brokerReducer,
    clock: clockReducer,
    emulator: emulatorReducer,
  },
});
