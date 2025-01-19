import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';

export const visionApi = {
  async analyzeImage(file: File, context: string): Promise<{
    analysis: string;
    suggestions?: string[];
    error?: string;
  }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('context', context);

    const response = await apiClient.post(API_ENDPOINTS.VISION + '/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async processSchedule(file: File): Promise<{
    schedule: any[];
    error?: string;
  }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(API_ENDPOINTS.VISION + '/schedule', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async analyzeMathProblem(file: File): Promise<{
    problem: string;
    solution: string;
    steps: string[];
    error?: string;
  }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(API_ENDPOINTS.VISION + '/math', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async analyzeText(file: File): Promise<{
    text: string;
    readingLevel: string;
    analysis: {
      mainIdeas: string[];
      vocabulary: string[];
      suggestions: string[];
    };
    error?: string;
  }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(API_ENDPOINTS.VISION + '/text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};