export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
}

export interface MoodEntry {
  id: string;
  timestamp: string;
  mood: {
    value: number;
    label: string;
  };
  notes?: string;
}

export interface UserProgress {
  totalPoints: number;
  availablePoints: number;
  bonusPoints: number;
  pointsHistory: Array<{
    id: string;
    type: 'earned' | 'spent';
    amount: number;
    description: string;
    timestamp: string;
  }>;
  achievements: any[];
  moodHistory: MoodEntry[];
  tasks: Task[];
  journalEntries: any[];
  latestMood?: MoodEntry;
} 