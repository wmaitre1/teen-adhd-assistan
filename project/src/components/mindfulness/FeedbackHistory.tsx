import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, ThumbsUp, ThumbsDown, Smile } from 'lucide-react';
import { format } from 'date-fns';
import type { ExerciseFeedback } from '../../types';

interface FeedbackHistoryProps {
  feedback?: ExerciseFeedback[];
}

export function FeedbackHistory({ feedback = [] }: FeedbackHistoryProps) {
  const recentFeedback = feedback.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Exercise Feedback</h2>
      </div>

      <div className="space-y-4">
        {recentFeedback.length > 0 ? (
          recentFeedback.map((entry) => (
            <div
              key={`${entry.exerciseId}-${entry.timestamp}`}
              className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{entry.exerciseName}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-900">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(entry.timestamp), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    entry.rating >= 4
                      ? 'bg-green-100 text-green-900'
                      : entry.rating >= 3
                      ? 'bg-yellow-100 text-yellow-900'
                      : 'bg-red-100 text-red-900'
                  }`}>
                    <span>{entry.rating}/5</span>
                  </span>
                  {entry.moodChange && (
                    <span className={`p-1 rounded-full ${
                      entry.moodChange === 'better'
                        ? 'bg-green-100 text-green-900'
                        : entry.moodChange === 'worse'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {entry.moodChange === 'better' ? (
                        <ThumbsUp className="h-4 w-4" />
                      ) : entry.moodChange === 'worse' ? (
                        <ThumbsDown className="h-4 w-4" />
                      ) : (
                        <Smile className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </div>
              {entry.notes && (
                <p className="mt-2 text-sm text-gray-900">{entry.notes}</p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-900">No feedback recorded yet</p>
            <p className="text-sm mt-1 text-gray-900">Complete an exercise to share your experience</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}