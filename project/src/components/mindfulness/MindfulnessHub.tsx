import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wind, Activity } from 'lucide-react';
import { MeditationTimer } from './MeditationTimer';
import { BreathingExercise } from './BreathingExercise';
import { MoodSelector } from '../mood/MoodSelector';
import { CurrentMood } from '../mood/CurrentMood';
import { useStore } from '../../lib/store';

export function MindfulnessHub() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const { userProgress, addMoodEntry } = useStore();
  const latestMood = userProgress.latestMood;

  const handleMoodSelect = (mood: { value: number; label: string; emoji: string }) => {
    addMoodEntry({
      mood,
      timestamp: new Date().toISOString(),
    });
    setShowMoodSelector(false);
  };

  const exercises = [
    {
      id: 'meditation',
      name: 'Quick Meditation',
      description: 'Short meditation sessions for focus and calm',
      icon: Brain,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      description: 'Guided breathing for stress relief',
      icon: Wind,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      id: 'mood',
      name: 'Mood Check-In',
      description: 'Track your emotional well-being',
      icon: Activity,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100',
      content: latestMood && <CurrentMood mood={latestMood} />,
    },
  ];

  return (
    <>
      {exercises.map(({ id, name, description, icon: Icon, color, iconBg, content }) => (
        <motion.button
          key={id}
          onClick={() => id === 'mood' ? setShowMoodSelector(true) : setActiveExercise(id)}
          className={`${color} p-6 rounded-xl text-left transition-shadow hover:shadow-md`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-start space-x-4">
            <span className={`p-3 rounded-lg ${iconBg}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              {content}
            </div>
          </div>
        </motion.button>
      ))}

      {/* Exercise Modals */}
      {activeExercise === 'meditation' && (
        <MeditationTimer onClose={() => setActiveExercise(null)} />
      )}
      {activeExercise === 'breathing' && (
        <BreathingExercise onClose={() => setActiveExercise(null)} />
      )}
      {showMoodSelector && (
        <MoodSelector
          onClose={() => setShowMoodSelector(false)}
          onSelect={handleMoodSelect}
        />
      )}
    </>
  );
}