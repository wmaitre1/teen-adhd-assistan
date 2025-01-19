import React, { createContext, useContext, useState, useCallback } from 'react';
import { VoiceManager } from '../lib/voice/voiceManager';

interface VoiceContextType {
  isListening: boolean;
  isInitialized: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetError: () => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [isListening, setIsListening] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [voiceManager, setVoiceManager] = useState<VoiceManager | null>(null);

  const initialize = useCallback(async () => {
    try {
      if (!voiceManager) {
        const manager = new VoiceManager();
        await manager.initialize();
        setVoiceManager(manager);
        setIsInitialized(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize voice'));
      throw err;
    }
  }, [voiceManager]);

  const startListening = useCallback(async () => {
    try {
      if (!voiceManager) {
        throw new Error('Voice manager not initialized');
      }
      await voiceManager.startListening();
      setIsListening(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start listening'));
      throw err;
    }
  }, [voiceManager]);

  const stopListening = useCallback(() => {
    if (voiceManager) {
      voiceManager.stopListening();
      setIsListening(false);
    }
  }, [voiceManager]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        isInitialized,
        error,
        initialize,
        startListening,
        stopListening,
        resetError,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}