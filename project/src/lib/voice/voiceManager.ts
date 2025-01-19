import { navigationCommands } from './navigationCommands';
import type { VoiceManagerOptions } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Voice configuration
const VOICE_CONFIG = {
  name: 'Coral',
  lang: 'en-US',
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0
};

const FUNCTIONS = [
  {
    name: 'navigate',
    description: 'Navigate to a specific page in the application',
    parameters: {
      type: 'object',
      properties: {
        route: {
          type: 'string',
          description: 'The route to navigate to',
          enum: Object.values(navigationCommands).map(cmd => cmd.route)
        }
      },
      required: ['route']
    }
  },
  {
    name: 'openTaskForm',
    description: 'Open the form to create a new task',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'openHomeworkForm',
    description: 'Open the form to add new homework',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'openJournalForm',
    description: 'Open the form to create a new journal entry',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'startMeditation',
    description: 'Start a meditation session',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'startBreathing',
    description: 'Start a breathing exercise',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'setFormField',
    description: 'Set a value in the currently open form',
    parameters: {
      type: 'object',
      properties: {
        field: {
          type: 'string',
          description: 'The name of the field to set'
        },
        value: {
          type: 'string',
          description: 'The value to set in the field'
        }
      },
      required: ['field', 'value']
    }
  }
];

export class VoiceManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private options: VoiceManagerOptions;
  private isInitialized = false;
  private isListening = false;
  private stream: MediaStream | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor(options: VoiceManagerOptions = {}) {
    this.options = options;
  }

  async initialize() {
    try {
      // Only initialize if not already initialized
      if (this.isInitialized) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      this.mediaRecorder = new MediaRecorder(stream);
      this.setupMediaRecorder();
      
      // Set up the voice
      await this.setupVoice();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize voice manager:', error);
      throw error;
    }
  }

  private async setupVoice() {
    // Wait for voices to be loaded
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise<void>(resolve => {
        speechSynthesis.onvoiceschanged = () => resolve();
      });
    }

    // Find the Coral voice or a suitable female voice
    const voices = speechSynthesis.getVoices();
    this.voice = voices.find(voice => 
      voice.name.toLowerCase().includes('coral') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('female')
    ) || voices[0];
  }

  private setupMediaRecorder() {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioChunks = [];
      await this.processAudioCommand(audioBlob);
    };
  }

  async startListening() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isListening) return;

    this.isListening = true;
    this.mediaRecorder?.start();

    // Only play introduction when explicitly starting to listen
    const introduction = await this.getEleanorIntroduction();
    await this.speakText(introduction);
  }

  async stopListening() {
    if (!this.isListening) return;

    this.isListening = false;
    this.mediaRecorder?.stop();
  }

  private async processAudioCommand(audioBlob: Blob) {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-command.webm');

      // Transcribe audio using backend API
      const transcribeResponse = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!transcribeResponse.ok) {
        throw new Error(`Transcription failed: ${transcribeResponse.statusText}`);
      }

      const transcript = await transcribeResponse.text();
      this.options.onTranscript?.(transcript);

      // Process command using backend API
      const processResponse = await fetch(`${API_BASE_URL}/api/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: transcript,
          context: {
            functions: FUNCTIONS
          }
        }),
        credentials: 'include'
      });

      if (!processResponse.ok) {
        throw new Error(`Command processing failed: ${processResponse.statusText}`);
      }

      const { content, functionCall } = await processResponse.json();

      if (functionCall) {
        const { name, parameters } = functionCall;
        if (name === 'navigate') {
          this.options.onCommand?.({
            type: 'navigation',
            route: parameters.route
          });
        } else {
          this.options.onCommand?.({
            type: 'action',
            functionCall: {
              name,
              parameters
            }
          });
        }

        // Provide voice feedback
        const feedback = await this.getActionFeedback(name, parameters);
        await this.speakText(feedback);
      } else if (content) {
        // If no function call, speak the response
        await this.speakText(content);
      }
    } catch (error) {
      console.error('Failed to process audio command:', error);
      this.options.onError?.(error as Error);
    }
  }

  private async getEleanorIntroduction(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: 'Generate Eleanor introduction',
          context: {
            type: 'introduction'
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get introduction: ${response.statusText}`);
      }

      const { content } = await response.json();
      return content || "Hi, I'm Eleanor, your AI assistant. I'm here to help you stay organized and focused.";
    } catch (error) {
      console.error('Failed to get introduction:', error);
      return "Hi, I'm Eleanor, your AI assistant. I'm here to help you stay organized and focused.";
    }
  }

  private async getActionFeedback(action: string, parameters: any): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: `Generate feedback for action: ${action}`,
          context: {
            type: 'feedback',
            action,
            parameters
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get feedback: ${response.statusText}`);
      }

      const { content } = await response.json();
      return content || 'Done!';
    } catch (error) {
      console.error('Failed to get feedback:', error);
      return 'Done!';
    }
  }

  private async speakText(text: string) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = VOICE_CONFIG.rate;
    utterance.pitch = VOICE_CONFIG.pitch;
    utterance.volume = VOICE_CONFIG.volume;
    utterance.lang = VOICE_CONFIG.lang;
    
    window.speechSynthesis.speak(utterance);
  }

  cleanup() {
    speechSynthesis.cancel(); // Cancel any ongoing speech
    this.stream?.getTracks().forEach(track => track.stop());
    this.mediaRecorder = null;
    this.stream = null;
    this.isInitialized = false;
    this.isListening = false;
  }
} 