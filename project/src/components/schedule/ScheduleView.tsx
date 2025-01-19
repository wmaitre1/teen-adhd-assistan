import React from 'react';
import { Clock, User } from 'lucide-react';
import type { Schedule } from '../../types';

interface ScheduleViewProps {
  schedule: Schedule[];
  loading: boolean;
  error: Error | null;
}

export function ScheduleView({ schedule, loading, error }: ScheduleViewProps) {
  if (loading) return <div>Loading schedule...</div>;
  if (error) return <div>Error loading schedule: {error.message}</div>;
  if (!schedule?.length) return <div>No classes scheduled</div>;

  return (
    <div className="space-y-4">
      {schedule.map((classItem) => (
        <div
          key={classItem.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="w-2 h-12 bg-primary rounded-full" />
            <div>
              <h3 className="font-semibold">{classItem.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{classItem.teacher}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>
                  {classItem.startTime} - {classItem.endTime}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm">
            <span className="px-2 py-1 bg-secondary rounded-full">
              {classItem.scheduleType}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}