import { useState, useCallback } from 'react';
import { LearningStyleTracker, LearningInteraction } from '../lib/learning/LearningStyleTracker';
import { useStore } from '../lib/store';

export function useLearningStyle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useStore();

  const tracker = user ? new LearningStyleTracker(user.id) : null;

  const trackInteraction = useCallback(async (interaction: LearningInteraction) => {
    if (!tracker) return;

    try {
      setLoading(true);
      setError(null);
      await tracker.trackInteraction(interaction);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to track interaction'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tracker]);

  const getRecommendations = useCallback(async () => {
    if (!tracker) return null;

    try {
      setLoading(true);
      setError(null);
      return await tracker.getRecommendations();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get recommendations'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tracker]);

  const analyzeLearningPattern = useCallback(async () => {
    if (!tracker) return null;

    try {
      setLoading(true);
      setError(null);
      return await tracker.analyzeLearningPattern();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze learning pattern'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tracker]);

  return {
    trackInteraction,
    getRecommendations,
    analyzeLearningPattern,
    loading,
    error
  };
}