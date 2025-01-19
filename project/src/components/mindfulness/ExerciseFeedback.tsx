import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, ThumbsUp, ThumbsDown, MessageCircle, X } from 'lucide-react';
import { useStore } from '../../lib/store';

interface ExerciseFeedbackProps {
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
}

export function ExerciseFeedback({ exerciseId, exerciseName, onClose }: ExerciseFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [moodChange, setMoodChange] = useState<'better' | 'same' | 'worse' | null>(null);
  const [notes, setNotes] = useState('');
  const { addExerciseFeedback } = useStore();

  const handleSubmit = () => {
    if (rating) {
      addExerciseFeedback({
        exerciseId,
        exerciseName,
        rating,
        moodChange,
        notes,
        timestamp: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">How was your session?</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Rate your experience
          </label>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`p-3 rounded-lg transition-colors text-gray-900 ${
                  rating === value
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Change */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            How do you feel now?
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setMoodChange('better')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors text-gray-900 ${
                moodChange === 'better'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span>Better</span>
            </button>
            <button
              onClick={() => setMoodChange('same')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors text-gray-900 ${
                moodChange === 'same'
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Smile className="h-5 w-5" />
              <span>Same</span>
            </button>
            <button
              onClick={() => setMoodChange('worse')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-colors text-gray-900 ${
                moodChange === 'worse'
                  ? 'bg-red-100 border-red-500 text-red-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
              <span>Worse</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Additional notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your thoughts about the exercise..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-gray-900"
            rows={3}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!rating}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Feedback
        </button>
      </div>
    </motion.div>
  );
}