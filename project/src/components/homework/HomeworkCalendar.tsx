import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { HomeworkAssignment } from '../../types';

interface HomeworkCalendarProps {
  assignments: HomeworkAssignment[];
  onComplete: (id: string) => void;
}

export function HomeworkCalendar({ assignments, onComplete }: HomeworkCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDay = (date: Date) => {
    return assignments.filter((assignment) =>
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-900"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayAssignments = getAssignmentsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] bg-white p-2 ${
                !isCurrentMonth ? 'text-gray-400' : 'text-gray-900'
              }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm ${
                    isSameDay(day, new Date())
                      ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : ''
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayAssignments.length > 0 && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                    {dayAssignments.length}
                  </span>
                )}
              </div>

              <div className="mt-1 space-y-1">
                {dayAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`text-xs p-1 rounded ${
                      getSubjectColor(assignment.subject)
                    } ${assignment.completed ? 'opacity-50' : ''}`}
                  >
                    <div className="truncate text-gray-900">{assignment.title}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getSubjectColor(subject: string) {
  switch (subject.toLowerCase()) {
    case 'math':
      return 'bg-blue-100 text-blue-900';
    case 'science':
      return 'bg-green-100 text-green-900';
    case 'english':
      return 'bg-purple-100 text-purple-900';
    default:
      return 'bg-gray-100 text-gray-900';
  }
}