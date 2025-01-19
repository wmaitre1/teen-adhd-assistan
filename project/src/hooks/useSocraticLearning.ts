import { useState, useCallback } from 'react';
import { SocraticMethod } from '../lib/learning/SocraticMethod';
import { useStore } from '../lib/store';
import type { SocraticQuestion } from '../types/socratic';

export function useSocraticLearning() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SocraticQuestion | null>(null);
  const { user } = useStore();

  const socraticMethod = new SocraticMethod();

  const startSession = useCallback(async (subject: string, topic: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const session = await socraticMethod.startLearningSession(user.id, subject, topic);
      const question = await socraticMethod.generateQuestion(session.id, '');
      setCurrentQuestion(question);

      return session;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start session'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const submitResponse = useCallback(async (response: string) => {
    if (!user || !currentQuestion) return;

    try {
      setLoading(true);
      setError(null);

      const result = await socraticMethod.processResponse(
        currentQuestion.id,
        user.id,
        response
      );

      if (result.nextQuestion) {
        setCurrentQuestion(result.nextQuestion);
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process response'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, currentQuestion]);

  return {
    startSession,
    submitResponse,
    currentQuestion,
    loading,
    error
  };
}