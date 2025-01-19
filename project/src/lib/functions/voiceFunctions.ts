import { VoiceCommandManager } from '../voice/VoiceCommandManager';
import { VoiceFeedback } from '../voice/VoiceFeedback';

export const voiceFunctions = {
  processVoiceCommand: async (audioBlob: Blob, context: {
    currentPage: string;
    userRole: string;
    previousCommands: string[];
  }) => {
    const voiceManager = VoiceCommandManager.getInstance();
    const voiceFeedback = VoiceFeedback.getInstance();

    try {
      // Process audio and get transcription
      const transcription = await voiceManager.processAudio(audioBlob);
      
      // Process command
      const result = await voiceManager.processCommand(transcription);

      // Provide feedback
      await voiceFeedback.speak(result.feedback || 'Command processed');

      return result;
    } catch (error) {
      console.error('Voice command processing failed:', error);
      await voiceFeedback.announceError('Sorry, I had trouble processing that command');
      throw error;
    }
  }
};