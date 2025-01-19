import { supabase } from '../supabase';

export interface LearningInteraction {
  method: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  success_rate: number;
  engagement_time: number;
  completion_rate: number;
  focus_score: number;
}

export interface LearningPattern {
  preferred_methods: string[];
  optimal_duration: number;
  best_time_of_day: string;
  challenging_areas: string[];
  successful_strategies: string[];
}

export class LearningStyleTracker {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async trackInteraction(interaction: LearningInteraction) {
    try {
      const { data, error } = await supabase
        .from('learning_interactions')
        .insert({
          user_id: this.userId,
          ...interaction,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to track interaction:', error);
      throw error;
    }
  }

  async analyzeLearningPattern(): Promise<LearningPattern> {
    try {
      // Get recent interactions (last 30 days)
      const { data: interactions, error } = await supabase
        .from('learning_interactions')
        .select('*')
        .eq('user_id', this.userId)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Analyze preferred learning methods
      const methodStats = this.calculateMethodStats(interactions);
      const timePatterns = this.analyzeTimePatterns(interactions);
      const strategies = this.identifySuccessfulStrategies(interactions);

      return {
        preferred_methods: this.getTopMethods(methodStats),
        optimal_duration: this.calculateOptimalDuration(interactions),
        best_time_of_day: timePatterns.bestTime,
        challenging_areas: this.identifyChallenges(interactions),
        successful_strategies: strategies
      };
    } catch (error) {
      console.error('Failed to analyze learning pattern:', error);
      throw error;
    }
  }

  private calculateMethodStats(interactions: any[]) {
    return interactions.reduce((stats: any, interaction) => {
      const method = interaction.method;
      if (!stats[method]) {
        stats[method] = {
          count: 0,
          success_total: 0,
          engagement_total: 0,
          focus_total: 0
        };
      }

      stats[method].count++;
      stats[method].success_total += interaction.success_rate;
      stats[method].engagement_total += interaction.engagement_time;
      stats[method].focus_total += interaction.focus_score;

      return stats;
    }, {});
  }

  private getTopMethods(methodStats: any) {
    return Object.entries(methodStats)
      .map(([method, stats]: [string, any]) => ({
        method,
        score: (
          stats.success_total / stats.count +
          stats.engagement_total / stats.count +
          stats.focus_total / stats.count
        ) / 3
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(item => item.method);
  }

  private calculateOptimalDuration(interactions: any[]) {
    const successfulSessions = interactions.filter(i => i.success_rate > 0.7);
    if (successfulSessions.length === 0) return 30; // Default duration

    return Math.round(
      successfulSessions.reduce((sum, i) => sum + i.engagement_time, 0) /
      successfulSessions.length
    );
  }

  private analyzeTimePatterns(interactions: any[]) {
    const timeSlots = interactions.reduce((slots: any, interaction) => {
      const hour = new Date(interaction.timestamp).getHours();
      const timeSlot = Math.floor(hour / 4); // 4-hour slots

      if (!slots[timeSlot]) {
        slots[timeSlot] = {
          count: 0,
          success_total: 0,
          focus_total: 0
        };
      }

      slots[timeSlot].count++;
      slots[timeSlot].success_total += interaction.success_rate;
      slots[timeSlot].focus_total += interaction.focus_score;

      return slots;
    }, {});

    let bestSlot = 0;
    let bestScore = 0;

    Object.entries(timeSlots).forEach(([slot, stats]: [string, any]) => {
      const score = (stats.success_total + stats.focus_total) / (stats.count * 2);
      if (score > bestScore) {
        bestScore = score;
        bestSlot = parseInt(slot);
      }
    });

    const timeRanges = [
      'Early Morning (6AM-10AM)',
      'Late Morning (10AM-2PM)',
      'Afternoon (2PM-6PM)',
      'Evening (6PM-10PM)',
      'Night (10PM-2AM)',
      'Late Night (2AM-6AM)'
    ];

    return {
      bestTime: timeRanges[bestSlot]
    };
  }

  private identifyChallenges(interactions: any[]) {
    const challenges = interactions
      .filter(i => i.success_rate < 0.5)
      .reduce((acc: any, i) => {
        if (!acc[i.subject]) {
          acc[i.subject] = 0;
        }
        acc[i.subject]++;
        return acc;
      }, {});

    return Object.entries(challenges)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);
  }

  private identifySuccessfulStrategies(interactions: any[]) {
    const successfulInteractions = interactions.filter(i => i.success_rate > 0.8);
    
    const strategies = successfulInteractions.reduce((acc: any, i) => {
      const key = `${i.method}-${i.strategy}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {});

    return Object.entries(strategies)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([strategy]) => strategy);
  }

  async getRecommendations(): Promise<{
    study_time: string;
    session_duration: number;
    preferred_methods: string[];
    suggested_breaks: number;
    focus_tips: string[];
  }> {
    const pattern = await this.analyzeLearningPattern();

    return {
      study_time: pattern.best_time_of_day,
      session_duration: pattern.optimal_duration,
      preferred_methods: pattern.preferred_methods,
      suggested_breaks: Math.ceil(pattern.optimal_duration / 25), // Break every 25 minutes
      focus_tips: this.generateFocusTips(pattern)
    };
  }

  private generateFocusTips(pattern: LearningPattern): string[] {
    const tips = [
      `Schedule study sessions during ${pattern.best_time_of_day} when you're most focused`,
      `Break study sessions into ${pattern.optimal_duration}-minute chunks`,
      `Use ${pattern.preferred_methods.join(' and ')} learning materials when possible`,
      'Take short breaks to maintain focus and energy',
      'Create a quiet, organized study space'
    ];

    return tips;
  }
}