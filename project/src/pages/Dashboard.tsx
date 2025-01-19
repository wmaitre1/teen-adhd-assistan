import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Calendar, BookOpen, Heart, Award } from 'lucide-react';
import { MoodTracker } from '../components/mood/MoodTracker';
import { EmotionalInsights } from '../components/mood/EmotionalInsights';
import { PointsDisplay } from '../components/points/PointsDisplay';
import { QuickActions } from '../components/dashboard/QuickActions';
import { TodayOverview } from '../components/dashboard/TodayOverview';
import { ProgressSnapshot } from '../components/dashboard/ProgressSnapshot';
import { useStore } from '../lib/store';

export function Dashboard() {
  const { tasks, assignments, grades, userProgress } = useStore();

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Mobile Quick Actions */}
      <div className="md:hidden">
        <QuickActions />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <TodayOverview 
            tasks={tasks} 
            assignments={assignments}
          />
          <ProgressSnapshot 
            assignments={assignments}
            grades={grades}
          />
        </div>

        {/* Right Column - Points & Mood */}
        <div className="space-y-6">
          <PointsDisplay />
          <MoodTracker />
          <EmotionalInsights moodEntries={userProgress.moodHistory} />
        </div>
      </div>
    </div>
  );
}