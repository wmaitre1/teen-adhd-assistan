// Socratic Learning Types
export interface SocraticLearning {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  level: number;
  startedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface SocraticQuestion {
  id: string;
  learningId: string;
  question: string;
  hint?: string;
  sequenceNumber: number;
}

export interface SocraticResponse {
  id: string;
  questionId: string;
  userId: string;
  response: string;
  confidenceScore?: number;
}

export interface SocraticSession {
  id: string;
  learningId: string;
  userId: string;
  duration: number;
  completionRate: number;
  metadata?: Record<string, any>;
}