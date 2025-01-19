import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';

// Type definitions for common response types
interface AIResponse<T> {
  data: T;
  error?: string;
  metadata?: {
    processingTime?: number;
    modelUsed?: string;
    tokensUsed?: number;
  };
}

// Type for error handling
interface AIError {
  code: string;
  message: string;
  details?: unknown;
}

export const ai = {
  async callAIEndpoint<T>(
    endpoint: string, 
    payload: Record<string, unknown>,
    options: {
      timeout?: number;
      retries?: number;
    } = {}
  ): Promise<AIResponse<T>> {
    const { timeout = 30000, retries = 3 } = options;
    let attempt = 0;

    while (attempt < retries) {
      try {
        const response = await apiClient.post(endpoint, payload, { timeout });
        return response.data;
      } catch (error) {
        attempt++;
        if (attempt === retries) {
          const aiError: AIError = {
            code: 'AI_REQUEST_FAILED',
            message: `Failed to call AI endpoint: ${endpoint}`,
            details: error
          };
          console.error(aiError);
          throw aiError;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Unexpected error in callAIEndpoint');
  },

  // Learning Assistance
  async generateJournalPrompt(mood: string) {
    return this.callAIEndpoint<string>(
      `${API_ENDPOINTS.AI_ASSIST}/journal-prompt`,
      { mood }
    );
  },

  async generateTaskBreakdown(taskDescription: string) {
    return this.callAIEndpoint<{
      steps: string[];
      estimatedDuration: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/task-breakdown`,
      { taskDescription }
    );
  },

  // Socratic Learning Methods
  async generateSocraticQuestion(topic: string, context: string) {
    return this.callAIEndpoint<{
      question: string;
      hints?: string[];
      concepts: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/socratic-question`,
      { topic, context }
    );
  },

  async analyzeSocraticResponse(question: string, response: string) {
    return this.callAIEndpoint<{
      understanding: number;
      nextQuestion: string;
      feedback: string;
      misconceptions?: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/analyze-response`,
      { question, response }
    );
  },

  // ADHD-Specific Support
  async simplifyExplanation(topic: string, complexity: string = '3rd-grade') {
    return this.callAIEndpoint<{
      simplified: string;
      visualCues?: string[];
      examples: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/simplify`,
      { topic, complexity }
    );
  },

  async suggestFocusTimer(taskDescription: string) {
    return this.callAIEndpoint<{
      duration: number;
      breakInterval: number;
      activitySuggestions: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/focus-timer`,
      { taskDescription }
    );
  },

  async generateMindfulnessExercise(mood: string) {
    return this.callAIEndpoint<{
      exercise: string;
      duration: number;
      benefits: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/mindfulness`,
      { mood }
    );
  },

  // Progress Analysis
  async analyzeBehavior(behaviorData: Record<string, unknown>) {
    return this.callAIEndpoint<{
      patterns: string[];
      recommendations: string[];
      alerts?: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/behavior-analysis`,
      { behaviorData }
    );
  },

  async suggestSpacedRepetitionSchedule(taskId: string, learningData: Record<string, unknown>) {
    return this.callAIEndpoint<{
      intervals: number[];
      adaptiveFactors: Record<string, number>;
      recommendations: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/spaced-repetition`,
      { taskId, learningData }
    );
  },

  // Content Processing
  async chunkContent(content: string) {
    return this.callAIEndpoint<{
      chunks: string[];
      summary: string;
      keyPoints: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/chunk-content`,
      { content }
    );
  },

  // General Chat
  async generalChat(prompt: string, context?: Record<string, unknown>) {
    return this.callAIEndpoint<{
      response: string;
      suggestions?: string[];
      relatedTopics?: string[];
    }>(
      `${API_ENDPOINTS.AI_ASSIST}/chat`,
      { prompt, context }
    );
  }
};