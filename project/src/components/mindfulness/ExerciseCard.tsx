import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Award, PlayCircle } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  icon: React.ElementType;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard = forwardRef<HTMLDivElement, ExerciseCardProps>(({ exercise }, ref) => {
  const Icon = exercise.icon;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-900';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-900';
      case 'advanced':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
            <p className="text-sm text-gray-900 mt-1">{exercise.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-900">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            getDifficultyColor(exercise.difficulty)
          }`}>
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </span>
        </div>
        <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
          <PlayCircle className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
});

ExerciseCard.displayName = 'ExerciseCard';