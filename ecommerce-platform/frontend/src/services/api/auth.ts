// ============================================
// AUTH API SERVICE
// ============================================

import { apiClient } from './client';
import type { User } from '@/types/models';
import type { ApiResponse, LoginRequest, RegisterRequest } from '@/types/api';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    
    // Store token
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', data);
    
    // Store token
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    await apiClient.post('/auth/logout');
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/auth/profile', data);
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/verify-email', { token });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/resend-verification');
  },
};
