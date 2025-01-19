import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { useStore } from '../../lib/store';
import type { Achievement } from '../../types';

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_task',
    title: 'Task Master',
    description: 'Complete your first task',
    icon: '🎯',
    points: 50,
  },
  {
    id: 'homework_streak',
    title: 'Homework Hero',
    description: 'Complete homework 5 days in a row',
    icon: '📚',
    points: 100,
  },
  {
    id: 'mindfulness_master',
    title: 'Zen Master',
    description: 'Complete 10 mindfulness exercises',
    icon: '🧘',
    points: 150,
  },
  // Add more achievements as needed
];

export function AchievementsList() {
  const { userProgress } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Award className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Achievements</h3>
      </div>

      <div className="grid gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = userProgress.achievements.some(
            (a) => a.id === achievement.id
          );

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg p-4 flex items-center space-x-4 ${
                isUnlocked ? 'border-2 border-primary' : ''
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  isUnlocked ? 'bg-primary/10' : 'bg-gray-100'
                }`}
              >
                {achievement.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{achievement.title}</h4>
                  {isUnlocked ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>

              <div className="text-right">
                <span className="text-sm font-medium text-primary">
                  +{achievement.points} pts
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}