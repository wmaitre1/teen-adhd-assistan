import React from 'react';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { DatabaseConnectionCheck } from '../components/parent/DatabaseConnectionCheck';

export function Onboarding() {
  return (
    <DatabaseConnectionCheck>
      <OnboardingFlow />
    </DatabaseConnectionCheck>
  );
}