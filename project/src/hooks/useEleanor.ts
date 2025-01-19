import { useState, useCallback } from 'react';
import { Eleanor } from '../lib/ai/eleanor/config';

export function useEleanor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const eleanor = Eleanor.getInstance();

  const chat = useCallback(async (
    input: string,
    context?: {
      page?: string;
      userRole?: string;
      previousContext?: string;
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      return await eleanor.chat(input, context);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to chat with Eleanor'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearConversation = useCallback(() => {
    eleanor.clearConversation();
  }, []);

  return {
    chat,
    clearConversation,
    loading,
    error
  };
}