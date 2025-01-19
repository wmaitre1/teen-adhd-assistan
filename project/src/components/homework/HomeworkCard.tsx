import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { HomeworkAssignment } from '../../types';

interface HomeworkCardProps {
  assignment: HomeworkAssignment;
  onComplete: (id: string) => void;
}

export function HomeworkCard({ assignment, onComplete }: HomeworkCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onComplete(assignment.id)}
          className={`p-2 rounded-full transition-colors ${
            assignment.completed
              ? 'text-primary bg-primary/10'
              : 'text-gray-900 hover:text-primary hover:bg-primary/10'
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <h3 className={`text-gray-900 font-medium ${assignment.completed ? 'line-through' : ''}`}>
            {assignment.title}
          </h3>

          {assignment.description && (
            <p className={`text-gray-900 mt-1 ${assignment.completed ? 'line-through' : ''}`}>
              {assignment.description}
            </p>
          )}

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-gray-900">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(assignment.dueDate), 'MMM d')}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-900">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(assignment.dueDate), 'h:mm a')}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-900`}>
              {assignment.subject}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}