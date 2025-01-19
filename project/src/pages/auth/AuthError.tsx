import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export function AuthError() {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message');

  const getErrorMessage = () => {
    switch (errorMessage) {
      case 'missing_config':
        return 'Missing Supabase configuration. Please check your environment variables.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-center space-x-2 text-red-500 mb-6">
          <AlertTriangle className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Authentication Error</h1>
        </div>

        <p className="text-center text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        <Link
          to="/"
          className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
}