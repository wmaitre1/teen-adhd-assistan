import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistMiddleware } from '../middleware';
import type { User } from '../../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, type?: 'student' | 'parent') => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: (email, password, type = 'student') => {
        set({
          user: {
            id: crypto.randomUUID(),
            name: type === 'student' ? 'Test Student' : 'Test Parent',
            email,
            role: type as 'student' | 'parent',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      ...persistMiddleware,
      name: 'user-storage'
    }
  )
);