import React from 'react';
import { useProgressStore } from '../../lib/store/progressStore';
import { useSettingsStore } from '../../lib/store/settingsStore';
import { AlertTriangle, ArrowRight, Brain } from 'lucide-react';

interface MoodTrend {
  label: string;
  color: string;
  description: string;
  needsCounseling: boolean;
  alert?: string;
}

interface LearningPattern {
  pattern: string;
  description: string;
  recommendations: string[];
}

export function AIInsights() {
  const { userProgress } = useProgressStore();
  const { aiAssistant } = useSettingsStore();

  const calculateMoodTrend = (): MoodTrend => {
    const recentMoods = userProgress.moodHistory.slice(0, 14); // Check last 2 weeks
    if (recentMoods.length === 0) {
      return {
        label: 'No Data',
        color: 'text-gray-400',
        description: 'Not enough mood data to analyze trends.',
        needsCounseling: false
      };
    }

    const moodCounts = recentMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      moodCounts[a[0]] > moodCounts[b[0]] ? a : b
    )[0];

    // Check for concerning patterns
    const needsCounseling = 
      (moodCounts['sad'] || 0) + (moodCounts['anxious'] || 0) + (moodCounts['overwhelmed'] || 0) >= 7 || // Half or more days with negative moods
      (moodCounts['angry'] || 0) + (moodCounts['frustrated'] || 0) >= 5; // Significant anger/frustration

    const getMoodTrendColor = (mood: string): string => {
      switch (mood) {
        case 'happy': return 'text-green-500';
        case 'calm': return 'text-blue-500';
        case 'anxious': return 'text-yellow-500';
        case 'sad': return 'text-purple-500';
        case 'angry': return 'text-red-500';
        case 'frustrated': return 'text-orange-500';
        default: return 'text-gray-500';
      }
    };

    let alert;
    if (needsCounseling) {
      if ((moodCounts['sad'] || 0) + (moodCounts['anxious'] || 0) >= 7) {
        alert = 'Your child has shown persistent signs of sadness or anxiety over the past two weeks. Consider scheduling a consultation with a school counselor or mental health professional.';
      } else if ((moodCounts['angry'] || 0) + (moodCounts['frustrated'] || 0) >= 5) {
        alert = 'Your child has displayed frequent frustration or anger recently. It may be helpful to discuss these feelings with a counselor or therapist.';
      }
    }

    return {
      label: dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1),
      color: getMoodTrendColor(dominantMood),
      description: `Your child has been feeling predominantly ${dominantMood} over the past two weeks.`,
      needsCounseling,
      alert
    };
  };

  const calculateTaskCompletion = () => {
    const recentTasks = userProgress.tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return taskDate >= weekAgo;
    });

    if (recentTasks.length === 0) {
      return {
        rate: 0,
        description: 'No tasks have been created in the past week.',
      };
    }

    const completedTasks = recentTasks.filter(task => task.completed);
    const completionRate = (completedTasks.length / recentTasks.length) * 100;

    return {
      rate: completionRate,
      description: `${completedTasks.length} out of ${recentTasks.length} tasks completed this week.`,
    };
  };

  const analyzeLearningPatterns = (): LearningPattern => {
    const completedTasks = userProgress.tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) {
      return {
        pattern: 'No Pattern',
        description: 'Not enough data to analyze learning patterns.',
        recommendations: ['Start with small, manageable tasks to build momentum.'],
      };
    }

    const subjectCounts = completedTasks.reduce((acc, task) => {
      if (task.subject) {
        acc[task.subject] = (acc[task.subject] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const strongestSubject = Object.entries(subjectCounts).reduce((a, b) => 
      subjectCounts[a[0]] > subjectCounts[b[0]] ? a : b
    )[0];

    return {
      pattern: 'Subject Focus',
      description: `Shows strong engagement in ${strongestSubject}.`,
      recommendations: [
        'Consider increasing challenge level in strong subjects',
        'Balance focus across all subjects',
        'Use successful strategies from strong subjects in others',
      ],
    };
  };

  const generateRecommendations = () => {
    const taskCompletion = calculateTaskCompletion();
    const learningPattern = analyzeLearningPatterns();
    const moodTrend = calculateMoodTrend();

    const recommendations = [];

    if (taskCompletion.rate < 50) {
      recommendations.push('Consider breaking down tasks into smaller, manageable steps.');
    }

    if (moodTrend.needsCounseling) {
      recommendations.push('Schedule a meeting with a school counselor or mental health professional to discuss recent emotional patterns.');
    } else if (moodTrend.label !== 'No Data') {
      recommendations.push(`Support emotional well-being by acknowledging and discussing feelings.`);
    }

    recommendations.push(...learningPattern.recommendations);

    return recommendations;
  };

  const moodTrend = calculateMoodTrend();
  const taskCompletion = calculateTaskCompletion();
  const learningPattern = analyzeLearningPatterns();
  const recommendations = generateRecommendations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">AI Insights & Alerts</h2>
        </div>
      </div>

      {moodTrend.needsCounseling && moodTrend.alert && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-700 mb-1">Counseling Recommended</h3>
              <p className="text-red-600">{moodTrend.alert}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Emotional Well-being</h3>
          <div className={`text-xl font-bold ${moodTrend.color} mb-2`}>
            {moodTrend.label}
          </div>
          <p className="text-gray-600">{moodTrend.description}</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Task Management</h3>
          <div className="text-xl font-bold text-blue-600 mb-2">
            {taskCompletion.rate.toFixed(1)}% Completion Rate
          </div>
          <p className="text-gray-600">{taskCompletion.description}</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Learning Insights</h3>
        <div className="mb-4">
          <div className="text-lg font-medium text-indigo-600 mb-2">
            {learningPattern.pattern}
          </div>
          <p className="text-gray-600">{learningPattern.description}</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      {aiAssistant.moderationEnabled && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertTriangle className="w-4 h-4" />
          <p>All insights are filtered through content moderation for safety.</p>
        </div>
      )}
    </div>
  );
}