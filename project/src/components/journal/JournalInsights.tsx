import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { format, subDays } from 'date-fns';
import type { JournalEntry } from '../../types';

export function JournalInsights({ entries }: { entries: JournalEntry[] }) {
  const recentEntries = entries.slice(0, 7);
  const averageMood = recentEntries.length > 0
    ? recentEntries.reduce((acc, entry) => acc + entry.mood.value, 0) / recentEntries.length
    : 0;

  const moodTrend = averageMood >= 4 ? 'Very Positive' : 
                    averageMood >= 3 ? 'Positive' :
                    averageMood >= 2 ? 'Neutral' : 'Needs Attention';

  const commonThemes = [
    "Focus on academic achievements",
    "Regular exercise and physical activity",
    "Social interactions and relationships",
    "Personal growth and learning"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Journal Insights</h2>
      </div>

      <div className="space-y-6">
        {/* Weekly Mood Analysis */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Weekly Mood Analysis</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Overall Trend</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                averageMood >= 4 ? 'bg-green-100 text-green-900' :
                averageMood >= 3 ? 'bg-blue-100 text-blue-900' :
                averageMood >= 2 ? 'bg-yellow-100 text-yellow-900' :
                'bg-red-100 text-red-900'
              }`}>
                {moodTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Common Themes */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Common Themes</h3>
          <div className="space-y-2">
            {commonThemes.map((theme, index) => (
              <div key={index} className="flex items-start space-x-2">
                <ArrowRight className="h-4 w-4 text-primary mt-1" />
                <span className="text-gray-900">{theme}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recent Activity</h3>
          <div className="space-y-3">
            {recentEntries.slice(0, 3).map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full ${
                  entry.mood.value >= 4 ? 'bg-green-100 text-green-900' :
                  entry.mood.value >= 3 ? 'bg-blue-100 text-blue-900' :
                  'bg-yellow-100 text-yellow-900'
                }`}>
                  {entry.mood.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h3>
          <div className="space-y-2">
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-sm text-gray-900">
                {averageMood >= 4 
                  ? "Keep up the great work! Consider sharing your positive experiences and strategies with others."
                  : averageMood >= 3
                  ? "You're doing well. Try incorporating more activities that bring you joy and energy."
                  : averageMood >= 2
                  ? "Consider trying some mindfulness exercises and talking to someone you trust about your feelings."
                  : "It might be helpful to speak with a counselor or trusted adult about what you're experiencing."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}