import React from 'react';
import { Book, Calculator, Flask, BookOpen, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HomeworkAssignment } from '../../types';

interface SubjectModulesProps {
  onSelectSubject: (subject: string) => void;
  activeSubject: string;
}

export function SubjectModules({ onSelectSubject, activeSubject }: SubjectModulesProps) {
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-blue-100 text-blue-800',
      description: 'Algebra, Geometry, Calculus',
    },
    {
      id: 'science',
      name: 'Science',
      icon: Flask,
      color: 'bg-green-100 text-green-800',
      description: 'Physics, Chemistry, Biology',
    },
    {
      id: 'english',
      name: 'English',
      icon: Book,
      color: 'bg-purple-100 text-purple-800',
      description: 'Literature, Grammar, Composition',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {subjects.map((subject) => {
        const Icon = subject.icon;
        const isActive = activeSubject === subject.id;

        return (
          <motion.button
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className={`relative p-6 rounded-xl text-left transition-all ${
              isActive
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white hover:bg-gray-50'
            }`}
            whileHover={{ scale: isActive ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <span
                className={`p-3 rounded-lg ${
                  isActive ? 'bg-white/20' : subject.color
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-semibold text-lg">{subject.name}</h3>
                <p
                  className={`text-sm mt-1 ${
                    isActive ? 'text-white/80' : 'text-gray-600'
                  }`}
                >
                  {subject.description}
                </p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}