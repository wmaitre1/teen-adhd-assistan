import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ChallengesStepProps {
  onComplete: (data: {
    primary_challenge: string;
    management_strategies: string[];
  }) => void;
  initialData?: {
    primary_challenge?: string;
    management_strategies?: string[];
  };
}

export function ChallengesStep({ onComplete, initialData }: ChallengesStepProps) {
  const [primaryChallenge, setPrimaryChallenge] = useState(initialData?.primary_challenge || '');
  const [strategies, setStrategies] = useState<string[]>(initialData?.management_strategies || []);

  const challenges = [
    { value: 'organization', label: 'Organization' },
    { value: 'emotions', label: 'Emotions' },
    { value: 'sensory', label: 'Sensory Processing' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'time_management', label: 'Time Management' },
    { value: 'work_school', label: 'Work/School' },
    { value: 'mixed', label: 'A mix of these' }
  ];

  const managementStrategies = [
    { value: 'medication', label: 'Medication' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'apps_tools', label: 'Apps/Tools' },
    { value: 'sensory_supports', label: 'Sensory Supports' },
    { value: 'lifestyle_changes', label: 'Lifestyle Changes' },
    { value: 'none', label: 'None yet' }
  ];

  const toggleStrategy = (value: string) => {
    const newStrategies = strategies.includes(value)
      ? strategies.filter(s => s !== value)
      : [...strategies, value];
    
    setStrategies(newStrategies);
    if (primaryChallenge) {
      onComplete({
        primary_challenge: primaryChallenge,
        management_strategies: newStrategies
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Daily Challenges</h2>
        </div>

        <p className="text-gray-600 mb-4">
          What area of life feels most impacted by ADHD or autism?
        </p>

        <div className="space-y-3">
          {challenges.map((challenge) => (
            <motion.button
              key={challenge.value}
              onClick={() => {
                setPrimaryChallenge(challenge.value);
                onComplete({
                  primary_challenge: challenge.value,
                  management_strategies: strategies
                });
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                primaryChallenge === challenge.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {challenge.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-4">
          What strategies or tools have you tried to manage ADHD or autism-related challenges?
          Select all that apply.
        </p>

        <div className="space-y-3">
          {managementStrategies.map((strategy) => (
            <motion.button
              key={strategy.value}
              onClick={() => toggleStrategy(strategy.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                strategies.includes(strategy.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {strategy.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}