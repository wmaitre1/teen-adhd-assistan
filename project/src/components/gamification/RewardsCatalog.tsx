import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Clock, X } from 'lucide-react';
import { useStore } from '../../lib/store';
import type { Reward } from '../../types';

const REWARDS: Reward[] = [
  {
    id: '1',
    title: '30 Minutes Extra Screen Time',
    description: 'Earn 30 minutes of additional screen time',
    pointsCost: 100,
    category: 'screen_time',
    available: true,
  },
  {
    id: '2',
    title: 'Skip One Chore',
    description: 'Skip one assigned chore of your choice',
    pointsCost: 200,
    category: 'privilege',
    available: true,
  },
  {
    id: '3',
    title: 'Choose Weekend Activity',
    description: 'Pick a special weekend activity',
    pointsCost: 300,
    category: 'activity',
    available: true,
  },
  // Add more rewards as needed
];

export function RewardsCatalog() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const { userProgress, spendPoints } = useStore();

  const handleRedeemReward = (reward: Reward) => {
    if (userProgress.availablePoints >= reward.pointsCost) {
      const success = spendPoints(
        reward.pointsCost,
        `Redeemed: ${reward.title}`
      );
      if (success) {
        // Show success message or trigger parent notification
        setSelectedReward(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Rewards Catalog</h3>
        </div>
        <span className="text-sm font-medium">
          Available Points: {userProgress.availablePoints}
        </span>
      </div>

      <div className="grid gap-4">
        {REWARDS.map((reward) => (
          <motion.button
            key={reward.id}
            onClick={() => setSelectedReward(reward)}
            className={`w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-shadow ${
              !reward.available || userProgress.availablePoints < reward.pointsCost
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={
              !reward.available || userProgress.availablePoints < reward.pointsCost
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{reward.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {reward.description}
                </p>
              </div>
              <span className="text-primary font-medium">
                {reward.pointsCost} pts
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Redeem Reward</h3>
                <button
                  onClick={() => setSelectedReward(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedReward.title}</h4>
                  <p className="text-gray-600 mt-1">
                    {selectedReward.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-medium">
                    {selectedReward.pointsCost} points
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Your Points</span>
                  <span className="font-medium">
                    {userProgress.availablePoints} points
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => handleRedeemReward(selectedReward)}
                    disabled={
                      userProgress.availablePoints < selectedReward.pointsCost
                    }
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redeem Reward
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}