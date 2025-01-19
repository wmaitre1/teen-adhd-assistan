import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { ANALYZE_HOMEWORK } from '../lib/graphql/mutations';

export function useImageProcessing() {
  const [processing, setProcessing] = useState(false);
  const [analyzeHomework] = useMutation(ANALYZE_HOMEWORK);

  const processImage = useCallback(
    async (file: File, subject: string) => {
      setProcessing(true);
      try {
        const { data } = await analyzeHomework({
          variables: { file, subject },
        });
        return data.analyzeHomework;
      } catch (error) {
        console.error('Image processing failed:', error);
        throw error;
      } finally {
        setProcessing(false);
      }
    },
    [analyzeHomework]
  );

  return {
    processImage,
    processing,
  };
}