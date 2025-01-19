import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ADHDTypeStepProps {
  onComplete: (data: { adhd_type: string }) => void;
  initialData?: { adhd_type?: string };
}

export function ADHDTypeStep({ onComplete, initialData }: ADHDTypeStepProps) {
  const [type, setType] = useState(initialData?.adhd_type || '');

  const options = [
    {
      value: 'inattentive',
      label: 'Predominantly Inattentive (ADHD-I)',
      description: 'Difficulty focusing, forgetfulness, daydreaming, and disorganization'
    },
    {
      value: 'hyperactive_impulsive',
      label: 'Predominantly Hyperactive-Impulsive (ADHD-HI)',
      description: 'Fidgeting, impulsivity, restlessness, or excessive talking'
    },
    {
      value: 'combined',
      label: 'Combined Type (ADHD-C)',
      description: 'A mix of inattentive and hyperactive-impulsive symptoms'
    },
    {
      value: 'unsure',
      label: "I'm not sure/I don't remember my specific diagnosis",
      description: ''
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">ADHD Type</h2>
      </div>

      <p className="text-gray-600">
        If you've been diagnosed with ADHD, which type were you diagnosed with?
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => {
              setType(option.value);
              onComplete({ adhd_type: option.value });
            }}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
              type === option.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="space-y-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-600">{option.description}</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}