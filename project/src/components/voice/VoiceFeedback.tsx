import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface VoiceFeedbackProps {
  text: string;
  confidence: number;
  isVisible?: boolean;
}

export function VoiceFeedback({ text, confidence, isVisible = true }: VoiceFeedbackProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="voice-feedback"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Volume2 className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-600">I heard:</p>
              <p className="font-medium text-gray-800">{text || 'Listening...'}</p>
              {confidence > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}