import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sound: boolean;
  taskReminders: boolean;
  homeworkReminders: boolean;
  mindfulnessReminders: boolean;
}

export interface VoiceSettings {
  enabled: boolean;
  voiceName: string;
  rate: number;
  pitch: number;
  volume: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AIAssistantSettings {
  enabled: boolean;
  anonymousMode: boolean;
  moderationEnabled: boolean;
  realTimeModeration: boolean;
  dataCollection: {
    learningPatterns: boolean;
    taskHistory: boolean;
    performanceMetrics: boolean;
    conversationHistory: boolean;
    adaptiveLearning: boolean;
    emotionalPatterns: boolean;
    homeworkProgress: boolean;
  };
  privacyPreferences: {
    allowPersonalization: boolean;
    shareAnonymousData: boolean;
    retentionPeriod: number;
    parentAccess: {
      enabled: boolean;
      accessLevel: 'full' | 'limited' | 'none';
      sharedInsights: string[];
    };
  };
  parentalControls: {
    enabled: boolean;
    supervisionLevel: 'none' | 'moderate' | 'strict';
    restrictedFeatures: string[];
  };
  learningPreferences: {
    preferredSubjects: string[];
    learningStyle: string;
    difficultyLevel: 'easy' | 'medium' | 'hard';
    adaptiveHints: boolean;
    focusAreas: string[];
  };
}

export interface SettingsState {
  theme: Theme;
  soundEnabled: boolean;
  notifications: {
    tasks: boolean;
    homework: boolean;
    mindfulness: boolean;
    journal: boolean;
  };
  accessibility: {
    colorBlindMode: boolean;
    highContrastMode: boolean;
  };
  distractionFreeMode: boolean;
}

const storage: StateStorage = {
  getItem: (name): string | null => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (name, value): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  removeItem: (name): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  },
};

const defaultSettings: SettingsState = {
  theme: 'system',
  soundEnabled: true,
  notifications: {
    tasks: true,
    homework: true,
    mindfulness: true,
    journal: true
  },
  accessibility: {
    colorBlindMode: false,
    highContrastMode: false
  },
  distractionFreeMode: false
};

export const useSettingsStore = create<SettingsState & {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSoundEnabled: (enabled: boolean) => void;
  updateNotifications: (notifications: SettingsState['notifications']) => void;
  setColorBlindMode: (enabled: boolean) => void;
  setHighContrastMode: (enabled: boolean) => void;
  setDistractionFreeMode: (enabled: boolean) => void;
}>((set) => ({
  ...defaultSettings,
  setTheme: (theme) => set({ theme }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  updateNotifications: (notifications) => set({ notifications }),
  setColorBlindMode: (colorBlindMode) => set((state) => ({ 
    accessibility: { ...state.accessibility, colorBlindMode } 
  })),
  setHighContrastMode: (highContrastMode) => set((state) => ({ 
    accessibility: { ...state.accessibility, highContrastMode } 
  })),
  setDistractionFreeMode: (distractionFreeMode) => set({ distractionFreeMode })
}));