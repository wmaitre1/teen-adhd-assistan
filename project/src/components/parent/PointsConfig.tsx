import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';

interface PointsConfigItem {
  id: string;
  activity_type: string;
  points: number;
}

export function PointsConfig() {
  const [config, setConfig] = useState<PointsConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('points_config')
        .select('*')
        .eq('parent_id', user.id)
        .order('activity_type');

      if (error) throw error;
      setConfig(data || []);
    } catch (error) {
      console.error('Failed to load points config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Points Configuration</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Activity</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading configuration...</p>
        </div>
      ) : config.length > 0 ? (
        <div className="space-y-4">
          {config.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900">{item.activity_type}</h3>
                <p className="text-sm text-gray-600">{item.points} points</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg">
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
          No point configurations found. Add some activities to get started.
        </p>
      )}
    </div>
  );
}