import { useUserStore } from './userStore';
import { useTaskStore } from './taskStore';
import { useProgressStore } from './progressStore';
import { useSettingsStore } from './settingsStore';

export function useStore() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    setUser
  } = useUserStore();

  const {
    tasks,
    assignments,
    addTask,
    updateTask,
    deleteTask,
    addAssignment,
    completeAssignment
  } = useTaskStore();

  const {
    grades,
    userProgress,
    addGrade,
    addMoodEntry
  } = useProgressStore();

  const {
    theme,
    soundEnabled,
    notifications,
    setTheme,
    setSoundEnabled,
    updateNotifications
  } = useSettingsStore();

  return {
    // User state
    user,
    isAuthenticated,
    login,
    logout,
    setUser,

    // Task state
    tasks,
    assignments,
    addTask,
    updateTask,
    deleteTask,
    addAssignment,
    completeAssignment,

    // Progress state
    grades,
    userProgress,
    addGrade,
    addMoodEntry,

    // Settings state
    theme,
    soundEnabled,
    notifications,
    setTheme,
    setSoundEnabled,
    updateNotifications
  };
}

// Re-export individual stores
export { useUserStore } from './userStore';
export { useTaskStore } from './taskStore';
export { useProgressStore } from './progressStore';
export { useSettingsStore } from './settingsStore';