import { useState, useRef, useCallback, useEffect } from 'react';
import { voiceApi } from '../lib/api/voice';

interface UseVoiceRecorderOptions {
  onTranscription?: (text: string) => void;
  onProcessedCommand?: (command: string) => void;
  maxDuration?: number;
}

interface RecordingState {
  isRecording: boolean;
  error: Error | null;
  stream: MediaStream | null;
}

export function useVoiceRecorder({
  onTranscription,
  onProcessedCommand,
  maxDuration = 10000
}: UseVoiceRecorderOptions = {}) {
  // State
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    error: null,
    stream: null
  });

  // Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout>();

  // Clean up function
  const cleanup = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (state.stream) {
      state.stream.getTracks().forEach(track => track.stop());
    }
    mediaRecorder.current = null;
    chunks.current = [];
    setState(prev => ({
      ...prev,
      isRecording: false,
      stream: null
    }));
  }, [state.stream]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleRecordingError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error : new Error('Recording failed');
    console.error('Recording error:', errorMessage);
    setState(prev => ({
      ...prev,
      error: errorMessage,
      isRecording: false
    }));
    cleanup();
  }, [cleanup]);

  const processRecording = useCallback(async (audioBlob: Blob) => {
    try {
      console.log('Processing audio recording...');
      const transcription = await voiceApi.transcribeAudio(audioBlob);
      console.log('Transcription received:', transcription);
      
      if (transcription) {
        onTranscription?.(transcription);
        const processedCommand = await voiceApi.processCommand(transcription);
        console.log('Command processed:', processedCommand);
        onProcessedCommand?.(processedCommand);
      }
    } catch (error) {
      handleRecordingError(error);
    }
  }, [onTranscription, onProcessedCommand, handleRecordingError]);

  const startRecording = useCallback(async () => {
    try {
      // Reset state
      setState(prev => ({ ...prev, error: null }));
      chunks.current = [];

      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false // Explicitly deny video
      });

      const options = {
        mimeType: MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/ogg'
      };

      mediaRecorder.current = new MediaRecorder(stream, options);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { 
          type: mediaRecorder.current?.mimeType || 'audio/webm' 
        });
        await processRecording(audioBlob);
        cleanup();
      };

      mediaRecorder.current.onerror = (event) => {
        handleRecordingError(event.error);
      };

      // Start recording
      mediaRecorder.current.start();
      setState(prev => ({
        ...prev,
        isRecording: true,
        stream,
        error: null
      }));

      // Set auto-stop timer
      timer.current = setTimeout(() => {
        stopRecording();
      }, maxDuration);

      console.log('Recording started successfully');
    } catch (error) {
      handleRecordingError(error);
    }
  }, [maxDuration, processRecording, cleanup, handleRecordingError]);

  const stopRecording = useCallback(() => {
    try {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      if (mediaRecorder.current?.state === 'recording') {
        console.log('Stopping recording...');
        mediaRecorder.current.stop();
        setState(prev => ({
          ...prev,
          isRecording: false
        }));
      }
    } catch (error) {
      handleRecordingError(error);
    }
  }, [handleRecordingError]);

  return {
    isRecording: state.isRecording,
    error: state.error,
    startRecording,
    stopRecording
  };
}