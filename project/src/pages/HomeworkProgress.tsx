import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { HomeworkTracker } from '../components/homework/HomeworkTracker';
import { ProgressDashboard } from '../components/progress/ProgressDashboard';
import { useStore } from '../lib/store';

export function HomeworkProgress() {
  const { assignments, grades, addAssignment, completeAssignment } = useStore();
  const [selectedTab, setSelectedTab] = useState('homework');
  const [showForm, setShowForm] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Listen for voice commands
  useEffect(() => {
    const handleVoiceHomework = (event: CustomEvent) => {
      const { description } = event.detail;
      if (description) {
        setInitialData({
          title: description,
          subject: '',
          dueDate: new Date().toISOString()
        });
        setShowForm(true);
      }
    };

    window.addEventListener('addHomework', handleVoiceHomework as EventListener);
    return () => {
      window.removeEventListener('addHomework', handleVoiceHomework as EventListener);
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Homework & Progress</h1>
        <p className="text-gray-600 mt-2">
          Track your assignments and monitor your academic progress
        </p>
      </header>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="homework">
          <HomeworkTracker
            assignments={assignments}
            onAddAssignment={addAssignment}
            onCompleteAssignment={completeAssignment}
            showForm={showForm}
            initialData={initialData}
            onCloseForm={() => {
              setShowForm(false);
              setInitialData(null);
            }}
          />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressDashboard
            assignments={assignments}
            grades={grades}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}