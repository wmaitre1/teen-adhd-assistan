import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface VoiceCommandButtonProps {
  onCommand?: (command: string) => void;
  className?: string;
}

export function VoiceCommandButton({ onCommand, className = '' }: VoiceCommandButtonProps) {
  const [showRecorder, setShowRecorder] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowRecorder(true)}
        className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        title="Voice command"
      >
        <Mic className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {showRecorder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Voice Command</h3>
                <button
                  onClick={() => setShowRecorder(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <VoiceRecorder
                onProcessedCommand={(command) => {
                  onCommand?.(command);
                  setShowRecorder(false);
                }}
                maxDuration={10000}
              />

              <p className="mt-4 text-sm text-gray-600">
                Speak your command clearly. Recording will automatically stop after 10 seconds.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}