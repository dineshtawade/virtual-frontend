import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { emulatorService } from '../services/emulatorService';
import { setBrokerData } from '../store/brokerSlice';
import { setActiveTab, setActionLogs } from '../store/emulatorSlice';

export const useEmulatorAction = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const logsQuery = useQuery({
    queryKey: ['actionLogs'],
    queryFn: async () => {
      const res = await emulatorService.getActionLogs();
      if (res?.data) {
        dispatch(setActionLogs(res.data));
      }
      return res?.data || [];
    },
  });

  const actionMutation = useMutation({
    mutationFn: ({ actionType, payload }) => emulatorService.executeAction(actionType, payload),
    onSuccess: (res) => {
      if (res?.data) {
        dispatch(setBrokerData(res.data));
      }
      queryClient.invalidateQueries({ queryKey: ['brokerState'] });
      queryClient.invalidateQueries({ queryKey: ['actionLogs'] });
    },
    onError: (err) => {
      // If error has a targetTab (e.g. Pro Plus required -> addons tab), auto-switch tab in UI
      if (err?.targetTab) {
        dispatch(setActiveTab(err.targetTab));
      }
      queryClient.invalidateQueries({ queryKey: ['actionLogs'] });
    },
  });

  const clearLogsMutation = useMutation({
    mutationFn: () => emulatorService.clearActionLogs(),
    onSuccess: () => {
      dispatch(setActionLogs([]));
      queryClient.invalidateQueries({ queryKey: ['actionLogs'] });
    },
  });

  return {
    actionLogs: logsQuery.data || [],
    isLoadingLogs: logsQuery.isLoading,
    executeAction: actionMutation.mutateAsync,
    isExecuting: actionMutation.isPending,
    lastActionResult: actionMutation.data,
    clearLogs: clearLogsMutation.mutate,
  };
};
