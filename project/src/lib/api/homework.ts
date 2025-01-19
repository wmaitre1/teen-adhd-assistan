import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';

export const homework = {
  async analyzeImage(file: File, subject: string) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('subject', subject);

    const response = await apiClient.post(
      API_ENDPOINTS.VISION + '/analyze-homework',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async solveMath(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post(
      API_ENDPOINTS.VISION + '/math-solve',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async getSubjects() {
    const response = await apiClient.get(API_ENDPOINTS.HOMEWORK_HELP + '/subjects');
    return response.data;
  },

  async submitQuestion(data: {
    question: string;
    subject: string;
    gradeLevel: string;
  }) {
    const response = await apiClient.post(
      API_ENDPOINTS.HOMEWORK_HELP + '/questions',
      data
    );
    return response.data;
  },
};