import React, { useState } from 'react';
import { Upload, Calendar, Bell, Plus } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import { ScheduleForm } from '../components/schedule/ScheduleForm';
import { ScheduleUpload } from '../components/schedule/ScheduleUpload';
import { ScheduleView } from '../components/schedule/ScheduleView';
import { NotificationSettings } from '../components/schedule/NotificationSettings';

export function Schedule() {
  const [isAddingClass, setIsAddingClass] = useState(false);
  const { schedule, loading, error } = useSchedule();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Schedule</h1>
          <p className="text-gray-600 mt-2">
            Manage your classes and get smart notifications
          </p>
        </div>
        <button
          onClick={() => setIsAddingClass(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Class</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Current Schedule</h2>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Calendar className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
            <ScheduleView schedule={schedule} loading={loading} error={error} />
          </div>

          {isAddingClass && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <ScheduleForm onClose={() => setIsAddingClass(false)} />
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Import Schedule</h2>
            <ScheduleUpload />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <NotificationSettings />
          </div>
        </section>
      </div>
    </div>
  );
}