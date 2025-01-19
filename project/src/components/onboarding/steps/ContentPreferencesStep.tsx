import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ContentPreferencesStepProps {
  onComplete: (data: {
    content_preferences: string[];
    feature_preferences: string[];
    subscription_preference: string;
  }) => void;
  initialData?: {
    content_preferences?: string[];
    feature_preferences?: string[];
    subscription_preference?: string;
  };
}

export function ContentPreferencesStep({ onComplete, initialData }: ContentPreferencesStepProps) {
  const [contentPrefs, setContentPrefs] = useState<string[]>(initialData?.content_preferences || []);
  const [featurePrefs, setFeaturePrefs] = useState<string[]>(initialData?.feature_preferences || []);
  const [subPreference, setSubPreference] = useState(initialData?.subscription_preference || '');

  const contentTypes = [
    { value: 'success_stories', label: 'Real-life ADHD success stories and strategies' },
    { value: 'expert_insights', label: 'Expert insights and advice from ADHD professionals' },
    { value: 'research_tips', label: 'Research-backed tips for managing focus and time' },
    { value: 'early_access', label: 'Early access to webinars and workshops' },
    { value: 'personalized', label: 'Personalized strategies and resources' }
  ];

  const features = [
    { value: 'live_chats', label: 'Live chats with ADHD professionals' },
    { value: 'qa_sessions', label: 'Q&A sessions with experts' },
    { value: 'webinars', label: 'Exclusive webinars and workshops' },
    { value: 'resources', label: 'Downloadable ADHD-specific guides' },
    { value: 'deep_dives', label: 'Monthly deep-dives into ADHD topics' }
  ];

  const toggleContent = (value: string) => {
    const newPrefs = contentPrefs.includes(value)
      ? contentPrefs.filter(p => p !== value)
      : [...contentPrefs, value];
    setContentPrefs(newPrefs);
    updateComplete(newPrefs, featurePrefs, subPreference);
  };

  const toggleFeature = (value: string) => {
    const newPrefs = featurePrefs.includes(value)
      ? featurePrefs.filter(p => p !== value)
      : [...featurePrefs, value];
    setFeaturePrefs(newPrefs);
    updateComplete(contentPrefs, newPrefs, subPreference);
  };

  const updateComplete = (content: string[], features: string[], sub: string) => {
    if (content.length > 0 && features.length > 0 && sub) {
      onComplete({
        content_preferences: content,
        feature_preferences: features,
        subscription_preference: sub
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Content Preferences</h2>
        </div>

        <p className="text-gray-600 mb-4">
          What type of content would you find most valuable? Select all that interest you.
        </p>

        <div className="space-y-3">
          {contentTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => toggleContent(type.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                contentPrefs.includes(type.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-4">
          Which features would make a premium newsletter worth subscribing to?
          Select all that appeal to you.
        </p>

        <div className="space-y-3">
          {features.map((feature) => (
            <motion.button
              key={feature.value}
              onClick={() => toggleFeature(feature.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                featurePrefs.includes(feature.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {feature.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-4">
          How much would you be willing to pay for a premium ADHD-focused newsletter?
        </p>

        <div className="grid grid-cols-3 gap-4">
          {['5', '7', '10'].map((price) => (
            <motion.button
              key={price}
              onClick={() => {
                setSubPreference(price);
                updateComplete(contentPrefs, featurePrefs, price);
              }}
              className={`p-4 text-center rounded-lg border-2 transition-colors ${
                subPreference === price
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              ${price}/month
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}