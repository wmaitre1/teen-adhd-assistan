import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Wind, Heart, Sparkles, MessageCircle, TrendingUp } from 'lucide-react';
import { MindfulnessHub } from '../components/mindfulness/MindfulnessHub';
import { ExerciseLibrary } from '../components/mindfulness/ExerciseLibrary';
import { FeedbackHistory } from '../components/mindfulness/FeedbackHistory';
import { MeditationTimer } from '../components/mindfulness/MeditationTimer';
import { BreathingExercise } from '../components/mindfulness/BreathingExercise';
import { useStore } from '../lib/store';

export function Mindfulness() {
  const { exerciseFeedback } = useStore();
  const [showMeditation, setShowMeditation] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);

  // Listen for voice commands
  useEffect(() => {
    const handleStartMeditation = () => {
      setShowMeditation(true);
    };

    const handleStartBreathing = () => {
      setShowBreathing(true);
    };

    window.addEventListener('startMeditation', handleStartMeditation);
    window.addEventListener('startBreathing', handleStartBreathing);

    return () => {
      window.removeEventListener('startMeditation', handleStartMeditation);
      window.removeEventListener('startBreathing', handleStartBreathing);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Mindfulness Center</h1>
        <p className="text-gray-900 mt-2">
          Take a moment to pause, breathe, and center yourself
        </p>
      </header>

      {/* Featured Exercises */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MindfulnessHub />
      </section>

      {/* Exercise modals */}
      {showMeditation && (
        <MeditationTimer onClose={() => setShowMeditation(false)} />
      )}
      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
}