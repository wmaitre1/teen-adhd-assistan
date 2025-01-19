import { apiClient } from './client';
import { API_ENDPOINTS } from '../constants';

interface VoiceAnalysisResult {
  level: string;
  fluency: number;
  comprehension: number;
  suggestions: string[];
  areas_for_improvement: string[];
}

interface CommandProcessingResult {
  intent: 'navigation' | 'task' | 'socratic' | 'unknown';
  action?: string;
  data?: Record<string, any>;
  feedback?: string;
}

export const voiceApi = {
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Create form data with audio file
    const formData = new FormData();
    formData.append('audio', audioBlob);

    // Add security headers
    const headers = {
      'Content-Type': 'multipart/form-data',
      'X-Request-ID': crypto.randomUUID(),
    };

    const response = await apiClient.post(API_ENDPOINTS.VOICE + '/transcribe', formData, {
      headers,
      timeout: 30000, // 30 second timeout
    });

    return response.data.text;
  },

  async processCommand(text: string, context?: {
    page?: string;
    userRole?: string;
    previousCommands?: string[];
  }): Promise<CommandProcessingResult> {
    const response = await apiClient.post(API_ENDPOINTS.VOICE + '/process-command', {
      text,
      context,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'X-Request-ID': crypto.randomUUID(),
      }
    });

    return response.data;
  },

  async analyzeReading(audioBlob: Blob, context?: {
    text?: string;
    subject?: string;
    gradeLevel?: string;
  }): Promise<VoiceAnalysisResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    if (context) {
      formData.append('context', JSON.stringify(context));
    }

    const response = await apiClient.post(API_ENDPOINTS.VOICE + '/analyze-reading', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Request-ID': crypto.randomUUID(),
      },
      timeout: 60000, // 60 second timeout for longer analysis
    });

    return response.data;
  },

  async getHistory(limit: number = 50): Promise<{
    commands: Array<{
      text: string;
      timestamp: string;
      success: boolean;
    }>;
    analytics: {
      successRate: number;
      commonCommands: string[];
      averageResponseTime: number;
    };
  }> {
    const response = await apiClient.get(API_ENDPOINTS.VOICE + '/history', {
      params: { limit },
      headers: {
        'X-Request-ID': crypto.randomUUID(),
      }
    });

    return response.data;
  }
};