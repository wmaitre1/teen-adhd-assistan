import { useState } from 'react';
import { SubjectAssistant } from '../lib/assistant/SubjectAssistant';
import { SUBJECTS } from '../lib/assistant/assistantConfig';

export function useSubjectAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const assistant = new SubjectAssistant();

  const getHint = async (problem: string, subject: keyof typeof SUBJECTS, previousHints: string[] = []) => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.provideHint(problem, subject, previousHints);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get hint'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const breakDownProblem = async (problem: string, subject: keyof typeof SUBJECTS) => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.breakDownProblem(problem, subject);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to break down problem'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSocraticQuestions = async (problem: string, subject: keyof typeof SUBJECTS, studentResponse?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.generateSocraticQuestions(problem, subject, studentResponse);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate questions'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPracticeProblems = async (problem: string, subject: keyof typeof SUBJECTS, difficulty: 'easier' | 'similar' | 'harder') => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.generateSimilarProblems(problem, subject, difficulty);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate practice problems'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = async (problem: string, answer: string, subject: keyof typeof SUBJECTS) => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.validateAnswer(problem, answer, subject);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check answer'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTopicGuidance = async (subject: keyof typeof SUBJECTS, topic: string) => {
    try {
      setLoading(true);
      setError(null);
      return await assistant.getSubjectGuidance(subject, topic);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get topic guidance'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getHint,
    breakDownProblem,
    getSocraticQuestions,
    getPracticeProblems,
    checkAnswer,
    getTopicGuidance,
    loading,
    error
  };
}