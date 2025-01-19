import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  userType: 'student' | 'parent';
}

export function AuthLayout({ children, userType }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center mb-8">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold text-primary ml-2">ADHD Assist</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {userType === 'student' ? 'Student Login' : 'Parent Login'}
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
}