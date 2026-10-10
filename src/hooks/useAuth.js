import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const userQuery = useQuery({
    queryKey: ['authMe'],
    queryFn: async () => {
      if (!token) return null;
      const res = await authService.getProfile();
      return res?.data?.user;
    },
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (res) => {
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        queryClient.invalidateQueries({ queryKey: ['authMe'] });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload) => authService.register(payload),
    onSuccess: (res) => {
      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        queryClient.invalidateQueries({ queryKey: ['authMe'] });
      }
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.setQueryData(['authMe'], null);
    queryClient.invalidateQueries();
  };

  const storedUser = token && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const currentUser = token ? (userQuery.data || storedUser) : null;

  return {
    user: currentUser,
    isAuthenticated: !!token && !!currentUser,
    isSuperAdmin: !!token && currentUser?.role === 'superadmin',
    isLoading: userQuery.isLoading && !!token,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
};
