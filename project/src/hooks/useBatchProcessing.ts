import { useState, useCallback } from 'react';
import { BatchProcessor } from '../lib/batch/batchProcessor';

interface UseBatchProcessingOptions {
  onComplete?: (results: any[]) => void;
  onError?: (error: any) => void;
  pollingInterval?: number;
}

export function useBatchProcessing({
  onComplete,
  onError,
  pollingInterval = 5000
}: UseBatchProcessingOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const processor = BatchProcessor.getInstance();

  const submitBatch = useCallback(async (requests: any[]) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const batchId = await processor.createBatch(requests);
      
      // Start polling for status
      const pollInterval = setInterval(async () => {
        try {
          const status = await processor.getBatchStatus(batchId);
          
          if (status?.status === 'completed') {
            clearInterval(pollInterval);
            setLoading(false);
            setProgress(100);
            onComplete?.(status.output || []);
          } else if (status?.status === 'failed') {
            clearInterval(pollInterval);
            setLoading(false);
            const err = new Error(status.error || 'Batch processing failed');
            setError(err);
            onError?.(err);
          } else if (status?.status === 'processing') {
            // Estimate progress based on completed requests
            const completed = status.output?.length || 0;
            const total = requests.length;
            setProgress(Math.round((completed / total) * 100));
          }
        } catch (err) {
          clearInterval(pollInterval);
          setLoading(false);
          const error = err instanceof Error ? err : new Error('Failed to check batch status');
          setError(error);
          onError?.(error);
        }
      }, pollingInterval);

    } catch (err) {
      setLoading(false);
      const error = err instanceof Error ? err : new Error('Failed to submit batch');
      setError(error);
      onError?.(error);
    }
  }, [onComplete, onError, pollingInterval]);

  return {
    submitBatch,
    loading,
    error,
    progress
  };
}