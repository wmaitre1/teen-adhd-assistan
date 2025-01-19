import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface DiagnosisStepProps {
  onComplete: (data: { diagnosis: string }) => void;
  initialData?: { diagnosis?: string };
}

export function DiagnosisStep({ onComplete, initialData }: DiagnosisStepProps) {
  const [diagnosis, setDiagnosis] = useState(initialData?.diagnosis || '');

  const options = [
    { value: 'adhd', label: 'Yes, ADHD only' },
    { value: 'asd', label: 'Yes, Autism Spectrum Disorder (ASD) only' },
    { value: 'audhd', label: 'Yes, both ADHD and ASD (AuDHD)' },
    { value: 'suspected', label: 'No, but I suspect I might have one or both' },
    { value: 'exploring', label: "No, I'm just exploring" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Diagnosis Information</h2>
      </div>

      <p className="text-gray-600">
        Have you been officially diagnosed with ADHD or Autism Spectrum Disorder (ASD)?
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => {
              setDiagnosis(option.value);
              onComplete({ diagnosis: option.value });
            }}
            className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
              diagnosis === option.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}