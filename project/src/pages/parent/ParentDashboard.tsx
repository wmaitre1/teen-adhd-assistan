import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Book, Heart, TrendingUp } from 'lucide-react';
import { DatabaseConnectionCheck } from '../../components/parent/DatabaseConnectionCheck';
import { PointsConfig } from '../../components/parent/PointsConfig';
import { RewardsManager } from '../../components/parent/RewardsManager';
import { CreateChildAccount } from '../../components/parent/CreateChildAccount';
import { AIInsights } from '../../components/parent/AIInsights';

export function ParentDashboard() {
  return (
    <DatabaseConnectionCheck>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your child's progress and manage rewards</p>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Task Completion</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600 mt-1">Last 7 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Book className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Homework Progress</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">92%</p>
            <p className="text-sm text-gray-600 mt-1">Current week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">Mindfulness</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">4/5</p>
            <p className="text-sm text-gray-600 mt-1">Average mood</p>
          </motion.div>
        </div>

        {/* AI Insights & Create Child Account */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsights />
          <CreateChildAccount />
        </div>

        {/* Points Configuration */}
        <PointsConfig />

        {/* Rewards Management */}
        <RewardsManager />

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>

          <div className="space-y-4">
            {/* Activity items would go here */}
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </motion.div>
      </div>
    </DatabaseConnectionCheck>
  );
} 