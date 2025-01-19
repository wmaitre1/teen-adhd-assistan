import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface MoodSelectorProps {
  onClose: () => void;
  onSelect: (mood: { emoji: string; label: string; value: number }) => void;
}

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '😌', label: 'Calm', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😕', label: 'Worried', value: 2 },
  { emoji: '😢', label: 'Sad', value: 1 },
];

export function MoodSelector({ onClose, onSelect }: MoodSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">How are you feeling?</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => onSelect(mood)}
              className="p-4 rounded-lg hover:bg-gray-50 flex flex-col items-center space-y-2 transition-colors"
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-sm font-medium text-gray-900">{mood.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}