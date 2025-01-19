import { useState, useCallback } from 'react';
import { AssistantManager } from '../lib/assistant/assistantManager';
import { useStore } from '../lib/store';

interface SendMessageOptions {
  page?: string;
  userRole?: string;
  subject?: string;
  task?: string;
}

export function useAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useStore();

  const assistant = AssistantManager.getInstance();

  const sendMessage = useCallback(async (message: string, options?: SendMessageOptions) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      // Initialize assistant if needed
      await assistant.initializeAssistant(user);

      // Send message with context
      const response = await assistant.sendMessage(message, {
        page: options?.page,
        userRole: options?.userRole,
        subject: options?.subject,
        task: options?.task
      });

      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const startNewConversation = useCallback(async (context?: {
    page?: string;
    subject?: string;
    task?: string;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      await assistant.initializeAssistant(user);
      const threadId = await assistant.startConversation(context);

      return threadId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start conversation');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    sendMessage,
    startNewConversation,
    loading,
    error
  };
}