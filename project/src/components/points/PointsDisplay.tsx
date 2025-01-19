import React from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Award, Clock } from 'lucide-react';
import { useStore } from '../../lib/store';

export function PointsDisplay() {
  const { userProgress } = useStore();

  // Calculate progress percentage
  const nextReward = {
    name: "30 Minutes Extra Screen Time",
    pointsNeeded: 100
  };
  
  const pointsToNextReward = Math.max(0, nextReward.pointsNeeded - userProgress.availablePoints);
  const progressPercentage = Math.min(100, (userProgress.availablePoints / nextReward.pointsNeeded) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Your Points</h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Points Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">Current Points</span>
            <p className="text-2xl font-bold text-gray-900">{userProgress.availablePoints}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Bonus Points</span>
            <p className="text-2xl font-bold text-primary">{userProgress.bonusPoints}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Points Needed</span>
            <p className="text-2xl font-bold text-gray-900">{pointsToNextReward}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress to Next Reward</span>
            <span className="text-gray-900 font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Next Reward Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <span className="font-medium text-gray-900">Next Reward</span>
            </div>
            <span className="text-sm font-medium text-primary">{nextReward.pointsNeeded} pts</span>
          </div>
          <p className="text-sm text-gray-600">{nextReward.name}</p>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {userProgress.pointsHistory.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{activity.description}</span>
                </div>
                <span className={`font-medium ${
                  activity.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.type === 'earned' ? '+' : '-'}{activity.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}