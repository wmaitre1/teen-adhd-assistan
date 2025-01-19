import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import type { UserProgress } from '../../types';

interface PointsDisplayProps {
  userProgress: UserProgress;
}

export function PointsDisplay({ userProgress }: PointsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="h-6 w-6 text-primary" />
          <h3 className="text-lg text-gray-900 font-semibold">Your Points</h3>
        </div>
        <span className="text-2xl font-bold text-primary">
          {userProgress.availablePoints}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Earned</span>
          <span className="font-medium">{userProgress.totalPoints}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Available</span>
          <span className="font-medium">{userProgress.availablePoints}</span>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
        <div className="space-y-2">
          {userProgress.pointsHistory.slice(0, 3).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{transaction.description}</span>
              </div>
              <span
                className={`font-medium ${
                  transaction.type === 'earned'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.type === 'earned' ? '+' : '-'}
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}