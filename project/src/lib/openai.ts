// Types and error handling for OpenAI interactions
export class OpenAIError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'OpenAIError';
  }
}

// API endpoint configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper functions for API calls
export async function makeAPICall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new OpenAIError(`API call failed: ${response.statusText}`);
  }

  return response;
}

// Utility functions for common API calls
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  
  const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new OpenAIError(`Transcription failed: ${response.statusText}`);
  }

  return response.text();
}

export async function translateAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  
  const response = await fetch(`${API_BASE_URL}/api/translate`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new OpenAIError(`Translation failed: ${response.statusText}`);
  }

  return response.text();
}

export async function processVoiceCommand(
  text: string,
  context?: { 
    type?: string;
    messages?: any[];
    functions?: any[];
    user?: any;
  }
): Promise<any> {
  const response = await makeAPICall('process-voice', {
    method: 'POST',
    body: JSON.stringify({ text, context })
  });

  return response.json();
}