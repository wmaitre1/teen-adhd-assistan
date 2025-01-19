import React from 'react';
import { motion } from 'framer-motion';
import { Mic, AlertCircle } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

export const VoiceIndicator: React.FC = () => {
  const { transcript, confidence, error, isListening } = useVoice();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${error ? 'bg-red-100' : 'bg-primary/10'}`}>
          {error ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Mic className={`h-5 w-5 text-primary ${isListening ? 'animate-pulse' : ''}`} />
          )}
        </div>
        <div className="flex-1 space-y-2">
          {error ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                {transcript ? "I heard:" : "Listening..."}
              </p>
              {transcript && (
                <>
                  <p className="font-medium text-gray-800">{transcript}</p>
                  {confidence > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${confidence * 100}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-500 min-w-[60px] text-right">
                        {Math.round(confidence * 100)}% sure
                      </span>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};