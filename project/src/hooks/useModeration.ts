import { useState } from 'react';
import { moderateContent, isSafeForSchool } from '../lib/moderation';

interface UseModerationOptions {
  onViolation?: (categories: string[]) => void;
  strictMode?: boolean;
}

export function useModeration({ onViolation, strictMode = true }: UseModerationOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkContent = async (content: {
    text?: string;
    imageUrl?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const input = [];
      if (content.text) {
        input.push({ type: 'text', text: content.text });
      }
      if (content.imageUrl) {
        input.push({
          type: 'image_url',
          image_url: { url: content.imageUrl }
        });
      }

      const result = await moderateContent(input);
      const isSafe = isSafeForSchool(result);

      if (!isSafe) {
        const violatedCategories = Object.entries(result.categories)
          .filter(([_, violated]) => violated)
          .map(([category]) => category);

        onViolation?.(violatedCategories);
        throw new Error('Content violates safety guidelines');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Moderation check failed'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkContent,
    loading,
    error
  };
}