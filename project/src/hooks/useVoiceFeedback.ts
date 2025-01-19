import { useState, useEffect } from 'react';
import { VoiceCommandManager } from '../lib/voice/VoiceCommandManager';

interface VoiceFeedbackState {
  transcript: string;
  confidence: number;
  isListening: boolean;
}

export function useVoiceFeedback() {
  const [state, setState] = useState<VoiceFeedbackState>({
    transcript: '',
    confidence: 0,
    isListening: false
  });

  useEffect(() => {
    const voiceManager = VoiceCommandManager.getInstance();

    voiceManager.setTranscriptCallback((text: string, conf: number) => {
      setState(prev => ({
        ...prev,
        transcript: text,
        confidence: conf
      }));
    });

    // Listen for recording state changes
    const checkRecordingState = () => {
      setState(prev => ({
        ...prev,
        isListening: voiceManager.isRecognitionActive()
      }));
    };

    // Check state periodically
    const interval = setInterval(checkRecordingState, 100);

    return () => {
      clearInterval(interval);
      setState({
        transcript: '',
        confidence: 0,
        isListening: false
      });
    };
  }, []);

  return {
    transcript: state.transcript,
    confidence: state.confidence,
    isListening: state.isListening
  };
}