import React from 'react';
import { ImageUploader } from './ImageUploader';
import { useModeration } from '../../hooks/useModeration';

interface SafeImageUploaderProps {
  onUpload: (result: any) => void;
  type: 'math' | 'text' | 'schedule';
  maxSize?: number;
  className?: string;
}

export function SafeImageUploader(props: SafeImageUploaderProps) {
  const { checkContent } = useModeration({
    onViolation: (categories) => {
      console.warn('Image content violation:', categories);
    }
  });

  const handleUpload = async (result: any) => {
    // Check the image content if it's a data URL
    if (result.imageUrl) {
      const isSafe = await checkContent({ imageUrl: result.imageUrl });
      if (!isSafe) return;
    }

    // If there's text content (e.g., from OCR), check that too
    if (result.text) {
      const isSafe = await checkContent({ text: result.text });
      if (!isSafe) return;
    }

    props.onUpload(result);
  };

  return <ImageUploader {...props} onUpload={handleUpload} />;
}