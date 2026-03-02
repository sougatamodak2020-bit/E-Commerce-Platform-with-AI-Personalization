// ============================================
// CART API SERVICE
// ============================================

import { apiClient } from './client';
import type { Cart, CartItem } from '@/types/models';
import type { ApiResponse } from '@/types/api';

export const cartApi = {
  /**
   * Get user cart
   */
  getCart: async (): Promise<ApiResponse<Cart>> => {
    return apiClient.get<Cart>('/cart');
  },

  /**
   * Add item to cart
   */
  addToCart: async (productId: string, quantity: number = 1, variantId?: string): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>('/cart/items', {
      productId,
      quantity,
      variantId,
    });
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (itemId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    return apiClient.put<Cart>(`/cart/items/${itemId}`, { quantity });
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: string): Promise<ApiResponse<Cart>> => {
    return apiClient.delete<Cart>(`/cart/items/${itemId}`);
  },

  /**
   * Clear cart
   */
  clearCart: async (): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>('/cart');
  },

  /**
   * Apply coupon
   */
  applyCoupon: async (code: string): Promise<ApiResponse<Cart>> => {
    return apiClient.post<Cart>('/cart/coupon', { code });
  },

  /**
   * Remove coupon
   */
  removeCoupon: async (): Promise<ApiResponse<Cart>> => {
    return apiClient.delete<Cart>('/cart/coupon');
  },
};
