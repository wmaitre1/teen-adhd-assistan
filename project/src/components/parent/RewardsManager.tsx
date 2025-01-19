import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';
import { RewardForm } from './RewardForm';

interface Reward {
  id: string;
  title: string;
  description?: string;
  points_required: number;
  is_active: boolean;
}

export function RewardsManager() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const { user } = useStore();

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('parent_id', user.id)
        .order('points_required', { ascending: true });

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Gift className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Rewards Management</h2>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Reward</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading rewards...</p>
        </div>
      ) : rewards.length > 0 ? (
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">{reward.title}</h3>
                {reward.description && (
                  <p className="text-sm text-gray-600">{reward.description}</p>
                )}
                <p className="text-sm font-medium text-primary mt-1">
                  {reward.points_required} points required
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleEdit(reward)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-4">
          No rewards configured. Add some rewards to motivate your child.
        </p>
      )}

      {showForm && (
        <RewardForm
          reward={editingReward}
          onClose={() => {
            setShowForm(false);
            setEditingReward(null);
          }}
          onSave={() => {
            loadRewards();
            setShowForm(false);
            setEditingReward(null);
          }}
        />
      )}
    </div>
  );
}