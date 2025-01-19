import { supabase } from '../supabase';

export class PointsManager {
  static async awardPoints(userId: string, activityType: string, metadata?: any) {
    try {
      const { data: config } = await supabase
        .from('points_config')
        .select('points')
        .eq('activity_type', activityType)
        .single();

      if (!config) return;

      // Award regular points
      const { error } = await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          points: config.points,
          transaction_type: 'earned',
          activity_type: activityType,
          metadata
        });

      if (error) throw error;

      // Award bonus points for mindfulness/journal activities
      if (['mindfulness', 'journal', 'mood_tracking'].includes(activityType)) {
        await supabase
          .from('points_transactions')
          .insert({
            user_id: userId,
            points: 5, // Bonus points
            transaction_type: 'earned',
            activity_type: `${activityType}_bonus`,
            metadata
          });
      }
    } catch (error) {
      console.error('Failed to award points:', error);
    }
  }

  static async getPointsSummary(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('total_points, available_points, bonus_points')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
}