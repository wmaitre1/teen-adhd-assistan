import React, { useEffect } from 'react';
import { useVoice } from '../../contexts/VoiceContext';
import { useSettingsStore } from '../../lib/store/settingsStore';

export function VoiceWrapper({ children }: { children: React.ReactNode }) {
  const { initialize } = useVoice();
  const settings = useSettingsStore();

  useEffect(() => {
    // Only initialize if voice is enabled in settings
    if (settings.voice) {
      initialize().catch(console.error);
    }
  }, [settings.voice, initialize]); // Using settings.voice instead of voiceEnabled

  return <>{children}</>;
}