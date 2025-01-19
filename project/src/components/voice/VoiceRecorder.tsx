import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, X } from 'lucide-react';
import { VoiceCommandManager } from '../../lib/voice/VoiceCommandManager';

interface VoiceRecorderProps {
  onTranscription?: (text: string) => void;
  onProcessedCommand?: (command: any) => void;
  maxDuration?: number;
  className?: string;
}

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

export function VoiceRecorder({
  onTranscription,
  onProcessedCommand,
  maxDuration = 10000,
  className = ''
}: VoiceRecorderProps) {
  const [transcription, setTranscription] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const voiceManager = VoiceCommandManager.getInstance({
      continuousListening: false,
      enableGreeting: false
    });

    voiceManager.setTranscriptCallback((text: string, conf: number) => {
      setTranscription(text);
      setConfidence(conf);
      onTranscription?.(text);
    });

    voiceManager.setCommandCallback((result: CommandResult) => {
      onProcessedCommand?.(result);
    });

    return () => {
      voiceManager.cleanup();
    };
  }, [onTranscription, onProcessedCommand]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isRecording && maxDuration) {
      timeoutId = setTimeout(() => {
        stopRecording();
      }, maxDuration);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRecording, maxDuration]);

  useEffect(() => {
    if (transcription) {
      setShowFeedback(true);
    }
  }, [transcription]);

  const startRecording = async () => {
    try {
      setError(null);
      const voiceManager = VoiceCommandManager.getInstance();
      await voiceManager.startListening();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err instanceof Error ? err : new Error('Failed to start recording'));
    }
  };

  const stopRecording = async () => {
    try {
      const voiceManager = VoiceCommandManager.getInstance();
      voiceManager.stopListening();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setError(err instanceof Error ? err : new Error('Failed to stop recording'));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative flex items-center space-x-2 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-primary hover:bg-primary/90'
        } text-white px-4 py-2 rounded-lg transition-colors`}
        disabled={!!error}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center space-x-2"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Recording...</span>
            </motion.div>
          ) : (
            <motion.div
              key="start"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center space-x-2"
            >
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {(isRecording || showFeedback) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10"
          >
            {isRecording ? (
              <>
                <p className="text-sm text-gray-600">Listening...</p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: maxDuration / 1000, ease: 'linear' }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {maxDuration / 1000}s
                  </span>
                </div>
              </>
            ) : transcription && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Transcription</p>
                  <button
                    onClick={() => {
                      setTranscription('');
                      setShowFeedback(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{transcription}</p>
                {confidence > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(confidence * 100)}% confident
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error.message || 'An error occurred'}
        </p>
      )}
    </div>
  );
}