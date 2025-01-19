import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Brain, Book, Heart } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Task</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Brain className="h-5 w-5" />
          <span>Focus Mode</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Book className="h-5 w-5" />
          <span>Log Grade</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0 bg-purple-100 text-purple-800 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Heart className="h-5 w-5" />
          <span>Mindfulness</span>
        </motion.button>
      </div>
    </div>
  );
}