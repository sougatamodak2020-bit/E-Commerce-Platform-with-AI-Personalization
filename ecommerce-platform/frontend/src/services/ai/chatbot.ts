// ============================================
// AI CHATBOT SERVICE
// ============================================

import { apiClient } from '../api/client';
import type { ApiResponse } from '@/types/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: ChatMessage;
  suggestions?: string[];
  products?: any[];
}

export const aiChatbot = {
  /**
   * Send message to chatbot
   */
  sendMessage: async (message: string, conversationId?: string): Promise<ApiResponse<ChatResponse>> => {
    return apiClient.post<ChatResponse>('/ai/chat', {
      message,
      conversationId,
    });
  },

  /**
   * Get chat history
   */
  getChatHistory: async (conversationId: string): Promise<ApiResponse<ChatMessage[]>> => {
    return apiClient.get<ChatMessage[]>(`/ai/chat/${conversationId}`);
  },

  /**
   * Start new conversation
   */
  startConversation: async (): Promise<ApiResponse<{ conversationId: string }>> => {
    return apiClient.post<{ conversationId: string }>('/ai/chat/start');
  },

  /**
   * End conversation
   */
  endConversation: async (conversationId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/ai/chat/${conversationId}`);
  },
};
