import { OpenAIError, API_BASE_URL } from './openai';

export type Categories = {
  hate: boolean;
  'hate/threatening': boolean;
  harassment: boolean;
  'harassment/threatening': boolean;
  'self-harm': boolean;
  'self-harm/intent': boolean;
  'self-harm/instructions': boolean;
  sexual: boolean;
  'sexual/minors': boolean;
  violence: boolean;
  'violence/graphic': boolean;
};

export type CategoryScores = {
  hate: number;
  'hate/threatening': number;
  harassment: number;
  'harassment/threatening': number;
  'self-harm': number;
  'self-harm/intent': number;
  'self-harm/instructions': number;
  sexual: number;
  'sexual/minors': number;
  violence: number;
  'violence/graphic': number;
};

export interface ModerationResult {
  flagged: boolean;
  categories: Categories;
  category_scores: CategoryScores;
  model: string;
}

export interface ModerationConfig {
  model?: string;
  customThresholds?: Partial<CategoryScores>;
}

export const DEFAULT_CONFIG: ModerationConfig = {
  model: 'text-moderation-stable',
  customThresholds: {
    violence: 0.3,
    sexual: 0.2,
    hate: 0.4,
    harassment: 0.4,
    'self-harm': 0.1
  }
};

export async function moderateContent(
  content: string,
  config: ModerationConfig = DEFAULT_CONFIG
): Promise<ModerationResult> {
  if (!content.trim()) {
    throw new OpenAIError('Content cannot be empty');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, config }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Moderation failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    throw new OpenAIError(
      'Failed to moderate content: ' + (error.message || 'Unknown error'),
      error
    );
  }
}

export function isSafeForSchool(result: ModerationResult, config: ModerationConfig = DEFAULT_CONFIG): boolean {
  const thresholds = {
    ...DEFAULT_CONFIG.customThresholds,
    ...config.customThresholds
  };

  for (const [category, score] of Object.entries(result.category_scores)) {
    const threshold = thresholds[category as keyof CategoryScores];
    if (threshold && score > threshold) {
      return false;
    }
  }

  return true;
}

export function getViolatedCategories(result: ModerationResult, config: ModerationConfig = DEFAULT_CONFIG): string[] {
  const thresholds = {
    ...DEFAULT_CONFIG.customThresholds,
    ...config.customThresholds
  };

  return Object.entries(result.category_scores)
    .filter(([category, score]) => {
      const threshold = thresholds[category as keyof CategoryScores];
      return threshold && score > threshold;
    })
    .map(([category]) => category);
}