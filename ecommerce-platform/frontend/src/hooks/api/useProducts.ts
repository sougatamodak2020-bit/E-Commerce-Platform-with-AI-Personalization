// ============================================
// PRODUCTS HOOK
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import type { Product, ProductFilters, SortOption } from '@/types/models';
import type { CreateProductRequest, UpdateProductRequest } from '@/types/api';
import toast from 'react-hot-toast';

export const useProducts = (params?: {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: SortOption;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getProducts(params),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
};

export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productsApi.getFeaturedProducts(limit),
  });
};

export const useTrendingProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['products', 'trending', limit],
    queryFn: () => productsApi.getTrendingProducts(limit),
  });
};

export const useRelatedProducts = (productId: string, limit: number = 4) => {
  return useQuery({
    queryKey: ['products', 'related', productId, limit],
    queryFn: () => productsApi.getRelatedProducts(productId, limit),
    enabled: !!productId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: query.length > 2,
  });
};
