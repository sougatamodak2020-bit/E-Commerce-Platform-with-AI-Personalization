// ============================================
// ORDER API SERVICE
// ============================================

import { apiClient } from './client';
import type { Order, OrderStatus } from '@/types/models';
import type { ApiResponse, PaginatedResponse, CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/api';

export const ordersApi = {
  /**
   * Get all orders (for admin/seller)
   */
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    userId?: string;
  }): Promise<ApiResponse<PaginatedResponse<Order>>> => {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return apiClient.get<PaginatedResponse<Order>>(`/orders?${queryString}`);
  },

  /**
   * Get user orders
   */
  getUserOrders: async (userId: string): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>(`/orders/user/${userId}`);
  },

  /**
   * Get single order
   */
  getOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Create new order
   */
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>('/orders', data);
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (data: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> => {
    return apiClient.patch<Order>(`/orders/${data.orderId}/status`, {
      status: data.status,
      trackingNumber: data.trackingNumber,
      notes: data.notes,
    });
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: string, reason?: string): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
  },

  /**
   * Request refund
   */
  requestRefund: async (orderId: string, reason: string): Promise<ApiResponse<Order>> => {
    return apiClient.post<Order>(`/orders/${orderId}/refund`, { reason });
  },

  /**
   * Track order
   */
  trackOrder: async (orderNumber: string): Promise<ApiResponse<Order>> => {
    return apiClient.get<Order>(`/orders/track/${orderNumber}`);
  },

  /**
   * Get order statistics (for dashboard)
   */
  getOrderStats: async (startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiClient.get<any>(`/orders/stats?${params.toString()}`);
  },
};
