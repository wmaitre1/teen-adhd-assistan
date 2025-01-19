import { OpenAIError, API_BASE_URL } from '../openai';

export interface EmotionAnalysis {
  primaryEmotion: string;
  confidence: number;
  secondaryEmotions: Array<{
    emotion: string;
    confidence: number;
  }>;
  intensity: number;
  suggestions?: string[];
}

export async function analyzeVoiceEmotion(audioBlob: Blob): Promise<EmotionAnalysis> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.webm');

    const response = await fetch(`${API_BASE_URL}/api/voice/analyze`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Voice analysis failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new OpenAIError('Failed to analyze voice emotion: ' + error.message, error);
  }
}

export async function getEmotionalInsights(
  recentEmotions: EmotionAnalysis[],
  context?: {
    activity?: string;
    timeOfDay?: string;
    previousFeedback?: string[];
  }
): Promise<{
  patterns: string[];
  triggers?: string[];
  recommendations: string[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/voice/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotions: recentEmotions,
        context
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to get insights: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new OpenAIError('Failed to get emotional insights: ' + error.message, error);
  }
}