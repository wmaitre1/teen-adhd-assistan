// AI Analytics Types
export interface AIConversation {
  id: string;
  userId: string;
  context: string;
  startedAt: Date;
  endedAt?: Date;
  metadata?: Record<string, any>;
}

export interface EmotionalPattern {
  id: string;
  userId: string;
  patternType: string;
  confidence: number;
  detectedAt: Date;
  metadata?: Record<string, any>;
}

export interface LearningPattern {
  id: string;
  userId: string;
  subject: string;
  style: string;
  effectivenessScore: number;
  detectedAt: Date;
  metadata?: Record<string, any>;
}

export interface ModuleInteraction {
  id: string;
  userId: string;
  moduleName: string;
  interactionType: string;
  duration?: number;
  successRate?: number;
  metadata?: Record<string, any>;
}

export interface AIPreference {
  id: string;
  userId: string;
  preferenceType: string;
  value: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  userId: string;
  type: string;
  content: string;
  context?: Record<string, any>;
  actedOn: boolean;
}

export interface UserFeedback {
  id: string;
  userId: string;
  suggestionId: string;
  rating?: number;
  comment?: string;
}