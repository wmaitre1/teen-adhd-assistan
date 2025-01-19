import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import { ExerciseFeedback } from './ExerciseFeedback';

interface BreathingExerciseProps {
  onClose: () => void;
}

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const maxCycles = 3; // Number of breathing cycles before showing feedback

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isActive) {
      if (phase === 'inhale') {
        timeout = setTimeout(() => setPhase('hold'), 4000);
      } else if (phase === 'hold') {
        timeout = setTimeout(() => setPhase('exhale'), 4000);
      } else {
        timeout = setTimeout(() => {
          setPhase('inhale');
          setCycles(c => {
            const newCycles = c + 1;
            if (newCycles >= maxCycles) {
              setIsActive(false);
              setShowFeedback(true);
            }
            return newCycles;
          });
        }, 4000);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, isActive]);

  const handleDone = () => {
    setIsActive(false);
    setShowFeedback(true);
  };

  if (showFeedback) {
    return (
      <ExerciseFeedback
        exerciseId="breathing"
        exerciseName="4-4-4 Breathing"
        onClose={onClose}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Breathing Exercise</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <motion.div
            className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center relative"
            animate={{
              scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary"
              animate={{
                scale: phase === 'inhale' ? [1, 1.5] : phase === 'exhale' ? [1.5, 1] : 1.5,
                opacity: phase === 'hold' ? [1, 0.5, 1] : 1,
              }}
              transition={{ duration: 4, ease: "easeInOut", repeat: isActive ? Infinity : 0 }}
            />
            <span className="text-xl font-medium text-primary">
              {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
            </span>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsActive(!isActive)}
            className="btn-primary"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">Follow the circle's movement with your breath</p>
          <p className="text-sm mt-2">Cycle {cycles + 1} of {maxCycles}</p>

          <button
            onClick={handleDone}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}