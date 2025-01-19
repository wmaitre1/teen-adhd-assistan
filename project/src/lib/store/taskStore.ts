import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, HomeworkAssignment } from '../../types/index';

interface TaskState {
  tasks: Task[];
  assignments: HomeworkAssignment[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addAssignment: (assignment: HomeworkAssignment) => void;
  completeAssignment: (id: string) => void;
}

// Initial tasks for testing
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Math Homework',
    description: 'Chapter 5 exercises 1-10',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    completed: false,
    priority: 'high',
    tags: ['math', 'homework']
  },
  {
    id: '2',
    title: 'Read History Chapter',
    description: 'Chapter 3: World War II',
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    completed: false,
    priority: 'medium',
    tags: ['history', 'reading']
  }
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      assignments: [],

      addTask: (task: Omit<Task, 'id'>) => 
        set((state: TaskState) => ({
          tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
        })),

      updateTask: (taskId: string, updates: Partial<Task>) =>
        set((state: TaskState) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (taskId: string) =>
        set((state: TaskState) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      addAssignment: (assignment: HomeworkAssignment) =>
        set((state: TaskState) => ({
          assignments: [...state.assignments, assignment],
        })),

      completeAssignment: (id: string) =>
        set((state: TaskState) => ({
          assignments: state.assignments.map((assignment) =>
            assignment.id === id ? { ...assignment, completed: true } : assignment
          ),
        })),
    }),
    {
      name: 'task-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
);