import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface BatchProgressProps {
  progress: number;
  className?: string;
}

export function BatchProgress({ progress, className = '' }: BatchProgressProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Loader2 className={`h-4 w-4 ${progress < 100 ? 'animate-spin' : ''}`} />
          <span>Processing batch...</span>
        </div>
        <span>{progress}%</span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}