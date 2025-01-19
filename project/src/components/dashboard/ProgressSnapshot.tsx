import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Book, Brain } from 'lucide-react';
import type { HomeworkAssignment, Grade } from '../../types';

interface ProgressSnapshotProps {
  assignments: HomeworkAssignment[];
  grades: Grade[];
}

export function ProgressSnapshot({ assignments = [], grades = [] }: ProgressSnapshotProps) {
  const completionRate = assignments.length > 0
    ? (assignments.filter(a => a.completed).length / assignments.length) * 100
    : 0;

  const averageGrade = grades.length > 0
    ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length
    : 0;

  const recentGrades = grades.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-6 w-6 text-primary" />
        <h2 className="text-xl text-gray-900 font-semibold">Progress Snapshot</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Homework Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5 text-gray-900" />
              <h3 className="font-medium text-gray-900">Homework Progress</h3>
            </div>
            <span className="text-sm text-gray-900 font-medium">{Math.round(completionRate)}%</span>
          </div>
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-900 mt-2">
            {assignments.filter(a => a.completed).length} of {assignments.length} assignments completed
          </p>
        </div>

        {/* Grade Average */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-gray-900" />
              <h3 className="font-medium text-gray-900">Grade Average</h3>
            </div>
            <span className="text-sm text-gray-900 font-medium">{averageGrade.toFixed(1)}%</span>
          </div>
          <div className="space-y-2">
            {recentGrades.map((grade, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-900">{grade.subject}</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  grade.score >= 90 ? 'bg-green-100 text-green-900' :
                  grade.score >= 80 ? 'bg-blue-100 text-blue-900' :
                  grade.score >= 70 ? 'bg-yellow-100 text-yellow-900' :
                  'bg-red-100 text-red-800'
                }`}>
                  {grade.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}