import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface AuDHDTraitsStepProps {
  onComplete: (data: { audhd_traits: string[] }) => void;
  initialData?: { audhd_traits?: string[] };
}

export function AuDHDTraitsStep({ onComplete, initialData }: AuDHDTraitsStepProps) {
  const [selectedTraits, setSelectedTraits] = useState<string[]>(initialData?.audhd_traits || []);

  const traits = [
    {
      value: 'sensory',
      label: 'I struggle with sensory sensitivities',
      description: '(e.g., sounds, textures, lights)'
    },
    {
      value: 'routines',
      label: 'I rely on routines but find impulsivity disrupts them'
    },
    {
      value: 'social',
      label: 'Social interactions can feel draining or confusing'
    },
    {
      value: 'hyperfocus',
      label: 'I find it hard to balance hyperfocus with executive function challenges'
    }
  ];

  const toggleTrait = (value: string) => {
    const newTraits = selectedTraits.includes(value)
      ? selectedTraits.filter(t => t !== value)
      : [...selectedTraits, value];
    
    setSelectedTraits(newTraits);
    onComplete({ audhd_traits: newTraits });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">AuDHD Experience</h2>
      </div>

      <p className="text-gray-600">
        Which of the following resonates most with your experience? Select all that apply.
      </p>

      <div className="space-y-3">
        {traits.map((trait) => (
          <motion.button
            key={trait.value}
            onClick={() => toggleTrait(trait.value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
              selectedTraits.includes(trait.value)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="space-y-1">
              <div className="font-medium text-gray-900">{trait.label}</div>
              {trait.description && (
                <div className="text-sm text-gray-600">{trait.description}</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}