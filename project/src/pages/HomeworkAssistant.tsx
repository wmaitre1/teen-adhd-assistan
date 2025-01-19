import React, { useState } from 'react';
import { Upload, Camera, Mic, Plus } from 'lucide-react';
import { SubjectModules } from '../components/homework/SubjectModules';
import { HomeworkTracker } from '../components/homework/HomeworkTracker';
import { useStore } from '../lib/store';

export function HomeworkAssistant() {
  const [activeSubject, setActiveSubject] = useState('math');
  const { assignments, addAssignment, completeAssignment } = useStore();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Homework Assistant</h1>
        <p className="text-gray-600 mt-2">
          Get help with your homework and track your assignments
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Subject Modules</h2>
        <SubjectModules
          onSelectSubject={setActiveSubject}
          activeSubject={activeSubject}
        />
      </section>

      <section className="bg-white rounded-xl p-6 shadow-lg">
        <HomeworkTracker
          assignments={assignments}
          onAddAssignment={addAssignment}
          onCompleteAssignment={completeAssignment}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Upload Homework</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Upload className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-gray-600">
                  Drag and drop your homework here, or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, JPG, PNG files
                </p>
              </div>
              <button className="btn-primary">Choose File</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Capture</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 p-4 bg-secondary rounded-lg hover:bg-opacity-80 transition-colors">
                <Camera className="h-6 w-6" />
                <span>Take Photo</span>
              </button>
              <button className="flex items-center justify-center space-x-2 p-4 bg-secondary rounded-lg hover:bg-opacity-80 transition-colors">
                <Mic className="h-6 w-6" />
                <span>Voice Note</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
            <p className="text-gray-600">No recent homework sessions</p>
          </div>
        </div>
      </section>
    </div>
  );
}