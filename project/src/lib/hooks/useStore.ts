```typescript
import { useUserStore } from '../store/userStore';
import { useTaskStore } from '../store/taskStore';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';

// Combine all stores into a single hook
export function useStore() {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const { login, logout, setUser } = useUserStore();

  const { tasks, assignments, addTask, updateTask, deleteTask, addAssignment, completeAssignment } = useTaskStore();
  
  const { grades, userProgress, addGrade, addMoodEntry } = useProgressStore();

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
  };
}
```