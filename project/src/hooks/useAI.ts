import { useState, useCallback } from 'react';
import { ai } from '../lib/api/ai';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateJournalPrompt = useCallback(async (mood: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ai.generateJournalPrompt(mood);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generateJournalPrompt,
    loading,
    error,
  };
}