// ============================================
// WISHLIST HOOK
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import type { Wishlist, Product } from '@/types/models';
import type { ApiResponse } from '@/types/api';
import toast from 'react-hot-toast';

const wishlistApi = {
  getWishlist: () => apiClient.get<Wishlist[]>('/wishlist'),
  addToWishlist: (productId: string) => apiClient.post<Wishlist>('/wishlist', { productId }),
  removeFromWishlist: (productId: string) => apiClient.delete<void>(`/wishlist/${productId}`),
  checkInWishlist: (productId: string) => apiClient.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`),
};

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistApi.getWishlist,
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to wishlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from wishlist');
    },
  });

  const isInWishlist = (productId: string): boolean => {
    return wishlist?.data?.some(item => item.productId === productId) || false;
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeMutation.mutate(productId);
    } else {
      addMutation.mutate(productId);
    }
  };

  return {
    wishlist: wishlist?.data || [],
    isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    toggleWishlist,
    isInWishlist,
    itemCount: wishlist?.data?.length || 0,
  };
};
