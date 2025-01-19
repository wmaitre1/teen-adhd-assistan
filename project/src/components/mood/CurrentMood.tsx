import React from 'react';
import { format } from 'date-fns';
import type { MoodEntry } from '../../types';

interface CurrentMoodProps {
  mood: MoodEntry;
}

export function CurrentMood({ mood }: CurrentMoodProps) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{mood.mood.emoji}</span>
        <span className="text-sm text-gray-600">{mood.mood.label}</span>
      </div>
      <span className="text-xs text-gray-500">
        {format(new Date(mood.timestamp), 'h:mm a')}
      </span>
    </div>
  );
}