import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogService } from '../services/catalogService';

export const useCatalog = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const res = await catalogService.getCatalog();
      return res?.data;
    },
  });

  const updateFlagsMutation = useMutation({
    mutationFn: (flags) => catalogService.updateCatalogFlags(flags),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });

  const upsertPlanMutation = useMutation({
    mutationFn: (plan) => catalogService.upsertPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
    },
  });

  return {
    catalog: query.data,
    isLoading: query.isLoading,
    updateFlags: updateFlagsMutation.mutate,
    isUpdatingFlags: updateFlagsMutation.isPending,
    upsertPlan: upsertPlanMutation.mutate,
    isUpsertingPlan: upsertPlanMutation.isPending,
  };
};
