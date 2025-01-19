import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';
import { DiagnosisStep } from './steps/DiagnosisStep';
import { ADHDTypeStep } from './steps/ADHDTypeStep';
import { AuDHDTraitsStep } from './steps/AuDHDTraitsStep';
import { ChallengesStep } from './steps/ChallengesStep';
import { ContentPreferencesStep } from './steps/ContentPreferencesStep';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const navigate = useNavigate();
  const { user } = useStore();

  const steps = [
    DiagnosisStep,
    ADHDTypeStep,
    AuDHDTraitsStep,
    ChallengesStep,
    ContentPreferencesStep
  ];

  const handleStepComplete = async (stepResponses: any) => {
    const updatedResponses = { ...responses, ...stepResponses };
    setResponses(updatedResponses);

    if (currentStep === steps.length - 1) {
      await saveResponses(updatedResponses);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const saveResponses = async (finalResponses: any) => {
    try {
      const { error: responsesError } = await supabase
        .from('onboarding_responses')
        .insert({
          user_id: user?.id,
          ...finalResponses
        });

      if (responsesError) throw responsesError;

      const { error: progressError } = await supabase
        .from('onboarding_progress')
        .update({
          is_complete: true,
          completed_at: new Date().toISOString(),
          completed_steps: steps.map((_, i) => `step_${i + 1}`)
        })
        .eq('user_id', user?.id);

      if (progressError) throw progressError;

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding responses:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <CurrentStepComponent
              onComplete={handleStepComplete}
              initialData={responses}
            />

            <div className="mt-8 flex justify-between items-center">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep
                        ? 'bg-primary'
                        : index < currentStep
                        ? 'bg-primary/50'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}