import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';
import type { User } from '../../types';

export const assistantApi = {
  async initializeAssistant(user: User) {
    const response = await apiClient.post(API_ENDPOINTS.ASSISTANT + '/initialize', {
      user_id: user.id,
      role: user.role
    });
    return response.data;
  },

  async sendMessage(threadId: string, message: string, context?: {
    page?: string;
    userRole?: string;
    subject?: string;
    task?: string;
  }) {
    const response = await apiClient.post(API_ENDPOINTS.ASSISTANT + '/message', {
      thread_id: threadId,
      message,
      context
    });
    return response.data;
  },

  async startConversation(context?: {
    page?: string;
    subject?: string;
    task?: string;
  }) {
    const response = await apiClient.post(API_ENDPOINTS.ASSISTANT + '/conversation', {
      context
    });
    return response.data;
  }
};