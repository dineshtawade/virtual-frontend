import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brokerState: {
    brokerId: 'broker-demo-1',
    name: 'Prime Realty Broker',
    simulatedTime: new Date().toISOString(),
    baseSubscription: {
      active: false,
      accessSource: 'none',
      expiresAt: null,
      autoPayActive: false,
      autoPayPendingCancellation: false,
      paidThroughAt: null,
    },
    proPlusAddon: {
      active: false,
      expiresAt: null,
      autoPayActive: false,
      isBundledWithDI: false,
      autoPayPendingCancellation: false,
    },
  },
  featureAccess: {
    isDiActive: false,
    isProPlusActive: false,
    canUnlockRegular: false,
    canUnlockExclusive: false,
    canViewFullPhotos: false,
  },
  warnings: [],
};

const brokerSlice = createSlice({
  name: 'broker',
  initialState,
  reducers: {
    setBrokerData: (state, action) => {
      if (action.payload.brokerState) state.brokerState = action.payload.brokerState;
      if (action.payload.featureAccess) state.featureAccess = action.payload.featureAccess;
      if (action.payload.warnings) state.warnings = action.payload.warnings;
    },
    updateLocalBaseSub: (state, action) => {
      state.brokerState.baseSubscription = {
        ...state.brokerState.baseSubscription,
        ...action.payload,
      };
    },
    updateLocalProPlus: (state, action) => {
      state.brokerState.proPlusAddon = {
        ...state.brokerState.proPlusAddon,
        ...action.payload,
      };
    },
  },
});

export const { setBrokerData, updateLocalBaseSub, updateLocalProPlus } = brokerSlice.actions;
export default brokerSlice.reducer;
