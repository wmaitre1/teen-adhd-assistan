import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';
import type { User } from '../../types';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export const auth = {
  async register(data: {
    email: string;
    password: string;
    name: string;
    userType: 'student' | 'parent';
  }) {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH + '/register',
      data
    );
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH + '/login',
      { email, password }
    );
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};