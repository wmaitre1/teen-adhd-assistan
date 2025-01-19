import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Calendar, ArrowRight } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { MoodChart } from './MoodChart';

interface EmotionalInsightsProps {
  moodEntries: Array<{
    mood: { value: number; label: string };
    timestamp: Date;
    note?: string;
  }>;
}

export function EmotionalInsights({ moodEntries }: EmotionalInsightsProps) {
  const calculateMoodTrend = () => {
    if (moodEntries.length < 3) return null;

    const recentMoods = moodEntries.slice(0, 7);
    const averageMood = recentMoods.reduce((acc, entry) => acc + entry.mood.value, 0) / recentMoods.length;
    const lastWeekMoods = moodEntries.filter(entry => 
      entry.timestamp > subDays(new Date(), 7)
    );
    
    const moodVariability = calculateMoodVariability(lastWeekMoods);
    
    return {
      average: averageMood,
      trend: averageMood < 2.5 ? 'concerning' : averageMood < 3.5 ? 'neutral' : 'positive',
      variability: moodVariability,
      persistentLowMood: checkPersistentLowMood(lastWeekMoods),
    };
  };

  const calculateMoodVariability = (moods: typeof moodEntries) => {
    if (moods.length < 2) return 'stable';
    const variations = moods.slice(1).map((entry, index) => 
      Math.abs(entry.mood.value - moods[index].mood.value)
    );
    const avgVariation = variations.reduce((acc, val) => acc + val, 0) / variations.length;
    return avgVariation > 2 ? 'highly variable' : avgVariation > 1 ? 'moderate' : 'stable';
  };

  const checkPersistentLowMood = (moods: typeof moodEntries) => {
    const lowMoodCount = moods.filter(entry => entry.mood.value <= 2).length;
    return lowMoodCount >= 3; // Three or more low moods in a week
  };

  const trend = calculateMoodTrend();
  if (!trend) return null;

  const shouldAlertParent = trend.persistentLowMood || trend.variability === 'highly variable';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">Emotional Insights</h2>
      </div>

      <div className="space-y-6">
        {/* Mood Chart */}
        <div className="h-48">
          <MoodChart entries={moodEntries} />
        </div>

        {/* Trend Analysis */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">Weekly Mood Pattern</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trend.trend === 'positive'
                ? 'bg-green-100 text-green-800'
                : trend.trend === 'neutral'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trend.variability === 'stable'
                ? 'bg-green-100 text-green-800'
                : trend.variability === 'moderate'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {trend.variability.charAt(0).toUpperCase() + trend.variability.slice(1)}
            </span>
          </div>
        </div>

        {/* Alerts and Recommendations */}
        {shouldAlertParent && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Support Available</h3>
                <p className="mt-1 text-sm text-red-600">
                  We've noticed you might be going through a tough time. Remember, it's okay to ask for help:
                </p>
                <ul className="mt-2 text-sm text-red-600 space-y-1">
                  <li>• Talk to your parents or a trusted adult</li>
                  <li>• School counselor: (555) 123-4567</li>
                  <li>• Crisis Text Line: Text HOME to 741741</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Recommendations</h3>
          <ul className="space-y-2">
            {trend.trend === 'positive' ? (
              <>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Keep up the great work! Your positive outlook is inspiring.</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Consider sharing what's working well with your support network.</span>
                </li>
              </>
            ) : trend.trend === 'neutral' ? (
              <>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Try incorporating more activities you enjoy.</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Consider trying a mindfulness exercise to boost your mood.</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Remember that it's okay to not be okay.</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Consider reaching out to your support system.</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Try a guided breathing exercise to help manage stress.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Recent Patterns */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Recent Patterns</h3>
          <div className="space-y-1 text-sm text-gray-600">
            {moodEntries.slice(0, 3).map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{format(entry.timestamp, 'MMM d, h:mm a')}</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  entry.mood.value >= 4
                    ? 'bg-green-100 text-green-800'
                    : entry.mood.value >= 3
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {entry.mood.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}