import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useModeration } from '../../hooks/useModeration';

interface SafeContentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function SafeContentInput({
  onSubmit,
  placeholder = 'Enter your text...',
  maxLength = 1000,
  className = ''
}: SafeContentInputProps) {
  const [content, setContent] = useState('');
  const { checkContent, loading, error } = useModeration({
    onViolation: (categories) => {
      console.warn('Content violation:', categories);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const isSafe = await checkContent({ text: content });
    if (isSafe) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
        rows={4}
      />

      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>This content cannot be submitted. Please revise and try again.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {content.length}/{maxLength}
        </span>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}