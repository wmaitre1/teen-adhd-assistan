import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistMiddleware } from '../middleware';
import type { 
  Grade, 
  MoodEntry, 
  PointsHistory, 
  Achievement, 
  JournalEntry 
} from '../../types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category: 'homework' | 'study' | 'practice' | 'other';
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

interface UserProgress {
  totalPoints: number;
  availablePoints: number;
  bonusPoints: number;
  pointsHistory: PointsHistory[];
  achievements: Achievement[];
  moodHistory: MoodEntry[];
  journalEntries: JournalEntry[];
  latestMood?: MoodEntry;
  tasks: Task[];
}

interface ProgressState {
  grades: Grade[];
  userProgress: UserProgress;
  addGrade: (grade: Grade) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const initialProgress: UserProgress = {
  totalPoints: 0,
  availablePoints: 0,
  bonusPoints: 0,
  pointsHistory: [],
  achievements: [],
  moodHistory: [],
  journalEntries: [],
  tasks: [],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      grades: [],
      userProgress: initialProgress,

      addGrade: (grade: Grade) =>
        set((state: ProgressState) => ({
          grades: [...state.grades, grade],
        })),

      addMoodEntry: (entry: MoodEntry) =>
        set((state: ProgressState) => ({
          userProgress: {
            ...state.userProgress,
            moodHistory: [entry, ...state.userProgress.moodHistory],
            latestMood: entry,
          },
        })),

      addTask: (task: Omit<Task, 'id' | 'createdAt'>) =>
        set((state: ProgressState) => ({
          userProgress: {
            ...state.userProgress,
            tasks: [
              ...state.userProgress.tasks,
              {
                ...task,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                completed: false,
              },
            ],
          },
        })),

      updateTask: (id: string, updates: Partial<Task>) =>
        set((state: ProgressState) => ({
          userProgress: {
            ...state.userProgress,
            tasks: state.userProgress.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          },
        })),

      completeTask: (id: string) =>
        set((state: ProgressState) => ({
          userProgress: {
            ...state.userProgress,
            tasks: state.userProgress.tasks.map((task) =>
              task.id === id
                ? {
                    ...task,
                    completed: true,
                    completedAt: new Date().toISOString(),
                  }
                : task
            ),
          },
        })),

      deleteTask: (id: string) =>
        set((state: ProgressState) => ({
          userProgress: {
            ...state.userProgress,
            tasks: state.userProgress.tasks.filter((task) => task.id !== id),
          },
        })),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        grades: state.grades,
        userProgress: state.userProgress,
      }),
    }
  )
);