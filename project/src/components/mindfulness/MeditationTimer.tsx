import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { ExerciseFeedback } from './ExerciseFeedback';

interface MeditationTimerProps {
  onClose: () => void;
}

export function MeditationTimer({ onClose }: MeditationTimerProps) {
  const [duration, setDuration] = useState(180); // 3 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setShowFeedback(true);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const handleDone = () => {
    setIsActive(false);
    setShowFeedback(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  if (showFeedback) {
    return (
      <ExerciseFeedback
        exerciseId="meditation"
        exerciseName="Quick Meditation"
        onClose={onClose}
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Quick Meditation</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <motion.div
            className="w-48 h-48 rounded-full border-4 border-primary flex items-center justify-center relative"
            animate={{
              scale: isActive ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 4,
              repeat: isActive ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <span className="text-4xl font-bold text-gray-900">{formatTime(timeLeft)}</span>
          </motion.div>
        </div>

        <div className="flex justify-center space-x-4">
          <select
            value={duration}
            onChange={(e) => {
              const newDuration = Number(e.target.value);
              setDuration(newDuration);
              setTimeLeft(newDuration);
            }}
            className="rounded-lg border-gray-300 text-gray-900 bg-white"
            disabled={isActive}
          >
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
          </select>

          <button
            onClick={toggleTimer}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90"
          >
            {isActive ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <RotateCcw className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-900">
            Find a comfortable position and focus on your breath
          </p>
          
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