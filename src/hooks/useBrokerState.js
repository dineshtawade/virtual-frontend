import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { brokerService } from '../services/brokerService';
import { setBrokerData } from '../store/brokerSlice';
import { setSimulatedTime } from '../store/clockSlice';

export const useBrokerState = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['brokerState'],
    queryFn: async () => {
      const res = await brokerService.getBrokerState();
      if (res?.data) {
        dispatch(setBrokerData(res.data));
        if (res.data.brokerState?.simulatedTime) {
          dispatch(setSimulatedTime(res.data.brokerState.simulatedTime));
        }
      }
      return res?.data;
    },
    staleTime: 5000,
  });

  const updateStateMutation = useMutation({
    mutationFn: (payload) => brokerService.updateBrokerState(payload),
    onSuccess: (res) => {
      if (res?.data) {
        dispatch(setBrokerData(res.data));
        queryClient.invalidateQueries({ queryKey: ['brokerState'] });
      }
    },
  });

  const setClockMutation = useMutation({
    mutationFn: (simulatedTime) => brokerService.setSimulatedClock(simulatedTime),
    onSuccess: (res) => {
      if (res?.data) {
        dispatch(setBrokerData(res.data));
        queryClient.invalidateQueries({ queryKey: ['brokerState'] });
      }
    },
  });

  const applyPresetMutation = useMutation({
    mutationFn: (presetId) => brokerService.applyPreset(presetId),
    onSuccess: (res) => {
      if (res?.data) {
        dispatch(setBrokerData(res.data));
        queryClient.invalidateQueries({ queryKey: ['brokerState'] });
        queryClient.invalidateQueries({ queryKey: ['actionLogs'] });
      }
    },
  });

  return {
    brokerData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateBrokerState: updateStateMutation.mutate,
    isUpdating: updateStateMutation.isPending,
    setSimulatedClock: setClockMutation.mutate,
    isSettingClock: setClockMutation.isPending,
    applyPreset: applyPresetMutation.mutate,
    isApplyingPreset: applyPresetMutation.isPending,
  };
};
