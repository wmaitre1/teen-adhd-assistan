import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';

interface RewardFormProps {
  reward?: {
    id: string;
    title: string;
    description?: string;
    points_required: number;
  };
  onClose: () => void;
  onSave: () => void;
}

export function RewardForm({ reward, onClose, onSave }: RewardFormProps) {
  const [title, setTitle] = useState(reward?.title || '');
  const [description, setDescription] = useState(reward?.description || '');
  const [points, setPoints] = useState(reward?.points_required || 0);
  const [loading, setLoading] = useState(false);
  const { user } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      if (reward) {
        const { error } = await supabase
          .from('rewards')
          .update({
            title,
            description,
            points_required: points
          })
          .eq('id', reward.id)
          .eq('parent_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('rewards')
          .insert({
            parent_id: user.id,
            title,
            description,
            points_required: points
          });

        if (error) throw error;
      }

      await onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save reward:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {reward ? 'Edit Reward' : 'Add New Reward'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 text-gray-900"
              placeholder="Enter reward title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-gray-300 text-gray-900"
              placeholder="Enter reward description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Points Required
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border-gray-300 text-gray-900"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : reward ? 'Update Reward' : 'Add Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}