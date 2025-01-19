import { supabase } from '../supabase';

export const taskFunctions = {
  createTask: async (data: {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    tags?: string[];
  }) => {
    const { error } = await supabase
      .from('tasks')
      .insert(data);

    if (error) throw error;
    return { success: true };
  }
};