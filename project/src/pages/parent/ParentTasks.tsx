// @ts-expect-error React is needed for JSX
import React from 'react';
import { TaskManager } from '../TaskManager';

export function ParentTasks() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Child's Tasks</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage your child's tasks and activities
        </p>
      </header>

      <TaskManager />
    </div>
  );
} 