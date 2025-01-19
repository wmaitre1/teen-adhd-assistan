import React from 'react';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';
import type { Grade } from '../../types';

interface SubjectProgressProps {
  grades: Grade[];
}

export function SubjectProgress({ grades }: SubjectProgressProps) {
  const subjectAverages = grades.reduce((acc, grade) => {
    if (!acc[grade.subject]) {
      acc[grade.subject] = {
        total: grade.score,
        count: 1,
      };
    } else {
      acc[grade.subject].total += grade.score;
      acc[grade.subject].count += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const subjects = Object.entries(subjectAverages).map(([subject, data]) => ({
    subject,
    average: data.total / data.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Book className="h-6 w-6 text-primary" />
        <h3 className="text-lg text-gray-900 font-semibold">Subject Performance</h3>
      </div>

      <div className="space-y-4">
        {subjects.map(({ subject, average }) => (
          <motion.div
            key={subject}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{subject}</span>
              <span className="text-sm text-gray-900">{average.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${average}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}