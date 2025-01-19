import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <BrainCircuit className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold text-primary ml-4">ADHD Assist</h1>
          </div>
          <h2 className="text-xl text-foreground max-w-2xl mx-auto">
            An AI-powered homework assistant and task manager designed specifically
            for students with ADHD
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">For Students</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">Voice-powered task management</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">AI homework assistance</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">Smart planning system</span>
              </li>
            </ul>
            <Link
              to="/auth/student"
              className="btn-primary w-full block text-center py-3 rounded-lg"
            >
              Student Login
            </Link>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">For Parents</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">Monitor progress</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">Task approval system</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary/10 p-2 rounded-full mr-4">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                </span>
                <span className="text-card-foreground">Set reminders and goals</span>
              </li>
            </ul>
            <Link
              to="/auth/parent"
              className="btn-secondary w-full block text-center py-3 rounded-lg"
            >
              Parent Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}