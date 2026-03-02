// ============================================
// AUTH HOOK
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import type { LoginRequest, RegisterRequest } from '@/types/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.data?.user);
      toast.success('Welcome back!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.data?.user);
      toast.success('Account created successfully!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });

  return {
    user: user?.data,
    isLoading,
    isAuthenticated: !!user?.data,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
