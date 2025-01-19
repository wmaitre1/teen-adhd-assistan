import { useState } from 'react';
import { visionApi } from '../lib/api/vision';

interface UseVisionOptions {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  optimizeImage?: boolean;
}

export function useVision({
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  optimizeImage = true
}: UseVisionOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimizeImageFile = async (file: File): Promise<File> => {
    if (!optimizeImage) return file;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        // For high-res mode, ensure short side is 768px max
        if (width > height) {
          if (height > 768) {
            width = (width * 768) / height;
            height = 768;
          }
        } else {
          if (width > 768) {
            height = (height * 768) / width;
            width = 768;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type');
    }
    if (file.size > maxFileSize) {
      throw new Error('File too large');
    }
  };

  const analyzeMathProblem = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      validateFile(file);
      
      const optimizedFile = await optimizeImageFile(file);
      return await visionApi.analyzeMathProblem(optimizedFile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze math problem'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeText = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      validateFile(file);
      
      const optimizedFile = await optimizeImageFile(file);
      return await visionApi.analyzeText(optimizedFile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to analyze text'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const processSchedule = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      validateFile(file);
      
      const optimizedFile = await optimizeImageFile(file);
      return await visionApi.processSchedule(optimizedFile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process schedule'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeMathProblem,
    analyzeText,
    processSchedule,
    loading,
    error
  };
}