// ============================================
// PRODUCT API SERVICE
// ============================================

import { apiClient } from './client';
import type { Product, ProductFilters, SortOption } from '@/types/models';
import type { ApiResponse, PaginatedResponse, CreateProductRequest, UpdateProductRequest } from '@/types/api';
import { toQueryString } from '@/utils/helpers';

export const productsApi = {
  /**
   * Get all products with filters
   */
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    filters?: ProductFilters;
    sort?: SortOption;
    search?: string;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    const queryString = params ? toQueryString(params) : '';
    return apiClient.get<PaginatedResponse<Product>>(`/products?${queryString}`);
  },

  /**
   * Get single product by ID
   */
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Get product by slug
   */
  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    return apiClient.get<Product>(`/products/slug/${slug}`);
  },

  /**
   * Create new product
   */
  createProduct: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const formData = new FormData();
    
    // Append text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'images' && value !== undefined) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
    
    // Append images
    if (data.images) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }
    
    return apiClient.upload<Product>('/products', formData);
  },

  /**
   * Update product
   */
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  /**
   * Delete product
   */
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/products/${id}`);
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit: number = 8): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/products/featured?limit=${limit}`);
  },

  /**
   * Get related products
   */
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
  },

  /**
   * Get trending products
   */
  getTrendingProducts: async (limit: number = 8): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/products/trending?limit=${limit}`);
  },

  /**
   * Search products
   */
  searchProducts: async (query: string, limit: number = 20): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  },

  /**
   * Update product stock
   */
  updateStock: async (productId: string, quantity: number): Promise<ApiResponse<Product>> => {
    return apiClient.patch<Product>(`/products/${productId}/stock`, { quantity });
  },

  /**
   * Toggle product active status
   */
  toggleActive: async (productId: string): Promise<ApiResponse<Product>> => {
    return apiClient.patch<Product>(`/products/${productId}/toggle-active`);
  },
};
