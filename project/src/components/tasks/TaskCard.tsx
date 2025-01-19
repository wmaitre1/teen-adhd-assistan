import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl p-4 shadow-sm ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onComplete(task.id)}
          className={`p-2 rounded-full transition-colors ${
            task.completed
              ? 'text-primary bg-primary/10'
              : 'text-gray-900 hover:text-primary hover:bg-primary/10'
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <h3 className={`text-gray-900 font-medium ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-gray-900 mt-1 ${task.completed ? 'line-through' : ''}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-1 text-gray-900">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
            </div>

            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>

          {task.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <TagIcon className="h-4 w-4 text-gray-900" />
              <div className="flex gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-900 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-900 hover:text-primary hover:bg-primary/10 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-900 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}