import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import { useVision } from '../../hooks/useVision';

interface ImageUploaderProps {
  onUpload: (result: any) => void;
  type: 'math' | 'text' | 'schedule';
  maxSize?: number;
  className?: string;
}

export function ImageUploader({ onUpload, type, maxSize = 5 * 1024 * 1024, className = '' }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analyzeMathProblem, analyzeText, processSchedule, loading, error } = useVision({
    maxFileSize: maxSize,
    optimizeImage: true
  });

  const handleFileSelect = async (file: File) => {
    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Process image based on type
      let result;
      switch (type) {
        case 'math':
          result = await analyzeMathProblem(file);
          break;
        case 'text':
          result = await analyzeText(file);
          break;
        case 'schedule':
          result = await processSchedule(file);
          break;
      }

      onUpload(result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileSelect(file);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    input.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={() => setPreview(null)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="text-gray-600">
                  Drag and drop your image here, or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, WebP (max {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>Choose File</span>
                </button>
                <button
                  onClick={handleCameraCapture}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/90"
                >
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileSelect(file);
            }
          }}
        />
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            <span className="text-gray-600">Processing...</span>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}