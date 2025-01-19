import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';
import type { Task } from '../../types';

interface TaskFilters {
  status?: 'pending' | 'completed' | 'overdue';
  priority?: 'high' | 'medium' | 'low';
}

export const tasks = {
  async getAll(filters?: TaskFilters) {
    const response = await apiClient.get<Task[]>(API_ENDPOINTS.TASKS, {
      params: filters,
    });
    return response.data;
  },

  async create(task: Omit<Task, 'id'>) {
    const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS, task);
    return response.data;
  },

  async update(taskId: string, updates: Partial<Task>) {
    const response = await apiClient.put<Task>(
      `${API_ENDPOINTS.TASKS}/${taskId}`,
      updates
    );
    return response.data;
  },

  async delete(taskId: string) {
    await apiClient.delete(`${API_ENDPOINTS.TASKS}/${taskId}`);
  },
};