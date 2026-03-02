// ============================================
// ORDERS HOOK
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import type { OrderStatus } from '@/types/models';
import type { CreateOrderRequest } from '@/types/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.getOrders(params),
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: !!orderId,
  });
};

export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => ordersApi.getUserOrders(userId),
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.createOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Order placed successfully!');
      
      if (response.data?.id) {
        router.push(`/orders/${response.data.id}/confirmation`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { orderId: string; status: string; trackingNumber?: string }) =>
      ordersApi.updateOrderStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
      ordersApi.cancelOrder(orderId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      toast.success('Order cancelled');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};

export const useOrderStats = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['orders', 'stats', startDate, endDate],
    queryFn: () => ordersApi.getOrderStats(startDate, endDate),
  });
};
