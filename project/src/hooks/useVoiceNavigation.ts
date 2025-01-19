import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceCommandManager } from '../lib/voice/VoiceCommandManager';
import { VoiceFeedback } from '../lib/voice/VoiceFeedback';

interface CommandResult {
  type: 'navigation' | 'action' | 'error';
  route?: string;
  routeName?: string;
  functionCall?: {
    name: string;
    parameters: Record<string, any>;
  };
  feedback?: string;
  error?: string;
}

export function useVoiceNavigation() {
  const navigate = useNavigate();
  const voiceManager = VoiceCommandManager.getInstance();
  const voiceFeedback = VoiceFeedback.getInstance();

  const handleVoiceCommand = useCallback(async (command: string) => {
    if (!command?.trim()) {
      console.warn('Empty command received');
      return;
    }

    try {
      console.log('Processing voice command:', command);
      const result = await voiceManager.processCommand(command);
      
      switch (result.type) {
        case 'navigation':
          if (!result.route) {
            throw new Error('Navigation command missing route');
          }
          console.log('Navigating to:', result.route);
          navigate(result.route);
          await voiceFeedback.speak(
            result.feedback || `Navigating to ${result.routeName}`
          );
          break;

        case 'action':
          console.log('Executing action:', result.functionCall);
          await voiceFeedback.speak(
            result.feedback || 'Executing command'
          );
          break;

        case 'error':
          console.error('Command error:', result.error);
          await voiceFeedback.announceError(
            result.error || "I didn't understand that command"
          );
          break;

        default:
          console.error('Unknown command type:', result);
          await voiceFeedback.announceError(
            "I'm not sure how to handle that command"
          );
      }
    } catch (error) {
      console.error('Voice command processing error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "I didn't understand that command. Please try again.";
      
      await voiceFeedback.announceError(errorMessage);
    }
  }, [navigate]);

  return { 
    handleVoiceCommand,
    voiceManager, // Expose for direct access if needed
    voiceFeedback // Expose for direct access if needed
  };
}