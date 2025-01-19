import { StateStorage, StorageValue } from 'zustand/middleware';

const storage: StateStorage = {
  getItem: (name: string): StorageValue => {
    try {
      const value = localStorage.getItem(name);
      return value ?? null;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name: string, value: StorageValue): void => {
    try {
      if (typeof value !== 'string') {
        localStorage.setItem(name, JSON.stringify(value));
      } else {
        localStorage.setItem(name, value);
      }
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

export const persistMiddleware = {
  storage,
  name: 'adhd-assist-storage',
  partialize: (state: any) => ({
    tasks: state.tasks,
    assignments: state.assignments,
    grades: state.grades,
    userProgress: state.userProgress,
  }),
};