import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Wind, Heart, Search } from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';

const CATEGORIES = [
  { id: 'all', label: 'All Exercises' },
  { id: 'breathing', label: 'Breathing', icon: Wind },
  { id: 'meditation', label: 'Meditation', icon: Brain },
  { id: 'relaxation', label: 'Relaxation', icon: Heart },
];

export function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Exercise Library</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 text-gray-900 placeholder-gray-600 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
            }`}
          >
            {category.icon && <category.icon className="h-5 w-5" />}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}