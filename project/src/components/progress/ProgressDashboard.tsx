import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Book, Brain, Target } from 'lucide-react';
import { ProgressChart } from './ProgressChart';
import { SubjectProgress } from './SubjectProgress';
import { GoalTracker } from './GoalTracker';
import type { HomeworkAssignment, Grade, Goal } from '../../types';

interface ProgressDashboardProps {
  assignments: HomeworkAssignment[];
  grades: Grade[];
  goals?: Goal[];
}

export function ProgressDashboard({ assignments = [], grades = [], goals = [] }: ProgressDashboardProps) {
  const completionRate = assignments.length > 0
    ? (assignments.filter(a => a.completed).length / assignments.length) * 100
    : 0;

  const averageGrade = grades.length > 0
    ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Book className="h-6 w-6 text-primary" />
            <h3 className="text-lg text-gray-900 font-semibold">Assignment Completion</h3>
          </div>
          <div className="relative pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-900">Progress</span>
              <span className="font-medium text-gray-900">{Math.round(completionRate)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-lg text-gray-900 font-semibold">Average Grade</h3>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {averageGrade.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-900 mt-2">
            Based on {grades.length} graded assignments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="text-lg text-gray-900 font-semibold">Goals Progress</h3>
          </div>
          <div className="space-y-4">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-900">{goal.title}</span>
                  <span className="font-medium text-gray-900">{goal.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
            {goals.length === 0 && (
              <p className="text-center text-gray-900">No goals set</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <h3 className="text-lg text-gray-900 font-semibold">Performance Trends</h3>
            </div>
          </div>
          <ProgressChart grades={grades} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <SubjectProgress grades={grades} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <GoalTracker goals={goals} />
      </motion.div>
    </div>
  );
}