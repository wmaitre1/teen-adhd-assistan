import { StateStorage, StorageValue } from 'zustand/middleware';

const storage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

export const persistMiddleware = {
  storage,
  partialize: (state: any) => ({
    tasks: state.tasks,
    assignments: state.assignments,
    grades: state.grades,
    userProgress: state.userProgress,
    exerciseFeedback: state.exerciseFeedback,
  }),
};