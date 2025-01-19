import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { MoodChart } from '../mood/MoodChart';
import { CurrentMood } from '../mood/CurrentMood';
import { useStore } from '../../lib/store';
import type { Task, HomeworkAssignment } from '../../types';

interface TodayOverviewProps {
  tasks: Task[];
  assignments: HomeworkAssignment[];
}

export function TodayOverview({ tasks = [], assignments = [] }: TodayOverviewProps) {
  const { latestMood, userProgress } = useStore();
  
  const today = new Date();
  const todaysTasks = tasks.filter(task => 
    format(new Date(task.dueDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const todaysAssignments = assignments.filter(assignment =>
    format(new Date(assignment.dueDate), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h2 className="text-xl text-gray-900 font-semibold">Today's Overview</h2>
        </div>
        <span className="text-sm text-gray-900">
          {format(today, 'EEEE, MMMM d')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div>
          <h3 className="text-lg text-gray-900 font-medium mb-4">Tasks</h3>
          <div className="space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 
                      className={`h-5 w-5 ${
                        task.completed ? 'text-green-900' : 'text-gray-900'
                      }`}
                    />
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-900">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-900 text-center py-4">No tasks due today</p>
            )}
          </div>
        </div>

        {/* Homework Section */}
        <div>
          <h3 className="text-lg text-gray-900 font-medium mb-4">Homework</h3>
          <div className="space-y-3">
            {todaysAssignments.length > 0 ? (
              todaysAssignments.map(assignment => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 
                      className={`h-5 w-5 ${
                        assignment.completed ? 'text-green-900' : 'text-gray-900'
                      }`}
                    />
                    <div>
                      <span className={assignment.completed ? 'line-through text-gray-500' : ''}>
                        {assignment.title}
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        ({assignment.subject})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-900">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(assignment.dueDate), 'h:mm a')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-900 text-center py-4">No homework due today</p>
            )}
          </div>
        </div>

        {/* Mood Section */}
        <div className="space-y-4">
          <h3 className="text-lg text-gray-900 font-medium">Today's Mood</h3>
          {latestMood ? (
            <>
              <CurrentMood mood={latestMood} />
              <div className="h-32">
                <MoodChart 
                  entries={userProgress.moodHistory.slice(0, 5)} 
                  showLabels={false} 
                />
              </div>
            </>
          ) : (
            <p className="text-gray-900 text-center py-4">
              No mood tracked today
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}