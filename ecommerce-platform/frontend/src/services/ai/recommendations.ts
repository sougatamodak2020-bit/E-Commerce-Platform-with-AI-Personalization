// ============================================
// AI RECOMMENDATION SERVICE
// ============================================

import { apiClient } from '../api/client';
import type { Product, AIRecommendation } from '@/types/models';
import type { ApiResponse } from '@/types/api';

export const aiRecommendations = {
  /**
   * Get personalized product recommendations
   */
  getPersonalizedRecommendations: async (limit: number = 10): Promise<ApiResponse<AIRecommendation[]>> => {
    return apiClient.get<AIRecommendation[]>(`/ai/recommendations/personalized?limit=${limit}`);
  },

  /**
   * Get similar products
   */
  getSimilarProducts: async (productId: string, limit: number = 6): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/ai/recommendations/similar/${productId}?limit=${limit}`);
  },

  /**
   * Get frequently bought together
   */
  getFrequentlyBoughtTogether: async (productId: string): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/ai/recommendations/bought-together/${productId}`);
  },

  /**
   * Get trending products based on user behavior
   */
  getTrendingForUser: async (limit: number = 8): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/ai/recommendations/trending?limit=${limit}`);
  },

  /**
   * Get recommendations based on search query
   */
  getSearchRecommendations: async (query: string, limit: number = 5): Promise<ApiResponse<string[]>> => {
    return apiClient.get<string[]>(`/ai/recommendations/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  /**
   * Get smart search results
   */
  smartSearch: async (query: string, filters?: any): Promise<ApiResponse<Product[]>> => {
    return apiClient.post<Product[]>('/ai/search', { query, filters });
  },

  /**
   * Get product recommendations for empty cart
   */
  getCartRecommendations: async (): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>('/ai/recommendations/cart');
  },

  /**
   * Track user interaction for AI learning
   */
  trackInteraction: async (data: {
    productId: string;
    action: 'view' | 'add_to_cart' | 'purchase' | 'wishlist';
    metadata?: any;
  }): Promise<void> => {
    await apiClient.post('/ai/track', data);
  },
};
