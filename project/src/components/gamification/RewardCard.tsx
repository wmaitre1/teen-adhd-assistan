import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock } from 'lucide-react';
import { useStore } from '../../lib/store';
import type { Reward } from '../../types';

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const { userProgress, requestReward, user } = useStore();
  const isParent = user?.type === 'parent';
  const canAfford = userProgress.availablePoints >= reward.pointsCost;

  const handleRedeem = () => {
    if (!isParent && canAfford) {
      requestReward(reward.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl p-4 shadow-sm ${
        !canAfford ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{reward.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
          </div>
        </div>
        <span className="text-primary font-medium">{reward.pointsCost} pts</span>
      </div>

      {!isParent && (
        <button
          onClick={handleRedeem}
          disabled={!canAfford}
          className="w-full mt-4 px-4 py-2 bg-primary text-secondary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canAfford ? 'Redeem Reward' : 'Not Enough Points'}
        </button>
      )}
    </motion.div>
  );
}