export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'parent' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent_student_relationships?: {
    student: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  order?: number;
}

export interface HomeworkAssignment {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  attachments?: string[];
  grade?: number;
}

export interface Grade {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'quiz' | 'test' | 'homework' | 'project';
  feedback?: string;
}

export interface MoodEntry {
  id: string;
  mood: 'happy' | 'calm' | 'sad' | 'anxious' | 'angry' | 'frustrated';
  intensity: number;
  notes?: string;
  timestamp: string;
  triggers?: string[];
  activities?: string[];
}

export interface PointsHistory {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'academic' | 'mindfulness' | 'organization' | 'social';
  points: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Rest of the types remain the same...