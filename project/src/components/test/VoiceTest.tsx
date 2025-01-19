import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { VoiceCommandManager } from '../../lib/voice/VoiceCommandManager';
import { VoiceFeedback } from '../../lib/voice/VoiceFeedback';

export function VoiceTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const voiceManager = VoiceCommandManager.getInstance();
  const voiceFeedback = VoiceFeedback.getInstance();

  useEffect(() => {
    // Initialize voice recognition and feedback
    const init = async () => {
      try {
        // Initialize voice feedback first
        await voiceFeedback.initialize();
        
        // Then initialize voice recognition
        await voiceManager.initialize();
        voiceManager.setTranscriptCallback((text) => {
          console.log('Received transcript:', text);
          setLastCommand(text);
        });

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize voice:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize voice recognition');
      }
    };

    init();

    // Cleanup
    return () => {
      voiceFeedback.cancel();
      voiceManager.stopListening();
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!isInitialized) {
        setError('Voice system not yet initialized');
        return;
      }

      setError(null);
      
      // Cancel any ongoing speech before starting recording
      voiceFeedback.cancel();
      
      // Wait a moment for speech to fully stop
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsRecording(true);
      voiceManager.startListening();
      
      // Provide audio feedback after starting recognition
      await voiceFeedback.speak("Listening...", { rate: 1.2, volume: 0.8 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!isInitialized) return;
    
    voiceManager.stopListening();
    setIsRecording(false);
    await voiceFeedback.speak("Stopped listening.", { rate: 1.2, volume: 0.8 });
  };

  const testVoiceFeedback = async () => {
    try {
      if (!isInitialized) {
        setError('Voice system not yet initialized');
        return;
      }

      setError(null);
      setIsSpeaking(true);
      
      // Stop any ongoing recording
      if (isRecording) {
        voiceManager.stopListening();
        setIsRecording(false);
      }
      
      await voiceFeedback.speak(
        "Hello! I'm Eleanor, your ADHD assistant. How can I help you today?",
        { rate: 0.9, pitch: 1.1 }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test voice feedback');
    } finally {
      setIsSpeaking(false);
    }
  };

  const stopVoiceFeedback = () => {
    if (!isInitialized) return;
    
    voiceFeedback.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Voice Testing Interface</h1>
          <p className="text-gray-600 mt-2">Test voice commands and speech synthesis</p>
        </header>

        {!isInitialized && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-50 text-blue-800 p-4 rounded-lg"
          >
            Initializing voice system...
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voice Input Testing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Voice Input</h2>
            <div className="space-y-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isInitialized}
                className={`w-full flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors ${
                  !isInitialized
                    ? 'bg-gray-200 cursor-not-allowed'
                    : isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    <span>Start Recording</span>
                  </>
                )}
              </button>

              {lastCommand && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Last Command:</h3>
                  <p className="text-gray-600">{lastCommand}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Voice Output Testing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Voice Output</h2>
            <div className="space-y-4">
              <button
                onClick={isSpeaking ? stopVoiceFeedback : testVoiceFeedback}
                disabled={!isInitialized}
                className={`w-full flex items-center justify-center space-x-2 p-4 rounded-lg transition-colors ${
                  !isInitialized
                    ? 'bg-gray-200 cursor-not-allowed'
                    : isSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-5 w-5" />
                    <span>Stop Speaking</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5" />
                    <span>Test Voice</span>
                  </>
                )}
              </button>

              {lastResponse && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Last Response:</h3>
                  <p className="text-gray-600">{lastResponse}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-800 p-4 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Voice Command Examples</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• "Go to dashboard"</li>
            <li>• "Add task: Complete math homework by tomorrow"</li>
            <li>• "Start mindfulness exercise"</li>
            <li>• "Show my tasks"</li>
            <li>• "Help me with math"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}