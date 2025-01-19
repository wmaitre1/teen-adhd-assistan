import { supabase } from '../supabase';

export const formFunctions = {
  submitHomeworkForm: async (data: {
    subject: string;
    title: string;
    description?: string;
    dueDate: string;
    teacherName?: string;
    scheduleType: 'Every Day' | 'A Day' | 'B Day';
  }) => {
    const { error } = await supabase
      .from('homework_assignments')
      .insert(data);

    if (error) throw error;
    return { success: true };
  },

  submitJournalEntry: async (data: {
    content: string;
    mood: {
      emoji: string;
      label: string;
      value: number;
    };
    tags?: string[];
  }) => {
    const { error } = await supabase
      .from('journal_entries')
      .insert(data);

    if (error) throw error;
    return { success: true };
  },

  submitMindfulnessExercise: async (data: {
    exerciseId: string;
    rating: number;
    moodChange?: 'better' | 'same' | 'worse';
    notes?: string;
  }) => {
    const { error } = await supabase
      .from('exercise_feedback')
      .insert(data);

    if (error) throw error;
    return { success: true };
  }
};