import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceCommandManager } from '../lib/voice/VoiceCommandManager';
import { VoiceFeedback } from '../lib/voice/VoiceFeedback';
import { useStore } from '../lib/store';

export function useVoiceCommands() {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { user } = useStore();
  
  const voiceManager = VoiceCommandManager.getInstance();
  const voiceFeedback = VoiceFeedback.getInstance();

  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      setError(null);

      // Initialize if not already done
      await voiceManager.initialize();

      // Handle commands
      const handleCommand = async (result: any) => {
        console.log('Command result:', result);
        
        if (result.type === 'navigation' && result.route) {
          navigate(result.route);
          await voiceFeedback.speak(`Navigating to ${result.routeName}`);
        } 
        else if (result.type === 'action' && result.functionCall) {
          try {
            const { name, parameters } = result.functionCall;
            console.log('Executing function:', name, parameters);
            
            await voiceFeedback.speak(result.feedback || 'Executing command');
            
            voiceManager.resetGreeting();
          } catch (err) {
            console.error('Failed to execute command:', err);
            await voiceFeedback.announceError('Sorry, I had trouble executing that command');
          }
        }
        else if (result.type === 'error') {
          const errorMessage = result.error || 'Command not recognized';
          setError(new Error(errorMessage));
          await voiceFeedback.announceError(errorMessage);
        }
      };

      // Set up command handling before starting recognition
      await voiceManager.initialize();
      voiceManager.onCommand = handleCommand;
      await voiceManager.startListening();

    } catch (err) {
      console.error('Failed to start recording:', err);
      const error = err instanceof Error ? err : new Error('Failed to start recording');
      setError(error);
      setIsRecording(false);
      await voiceFeedback.announceError(error.message);
    }
  }, [navigate]);

  const stopRecording = useCallback(() => {
    voiceManager.stopListening();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording
  };
}