import { VoiceCommandManager } from '../lib/voice/VoiceCommandManager';

declare global {
  interface Window {
    voiceManager: VoiceCommandManager;
  }
}

export {};