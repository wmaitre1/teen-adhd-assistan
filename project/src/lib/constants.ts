// API endpoint constants for backend services
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  TASKS: '/api/tasks',
  HOMEWORK: '/api/homework',
  AI_ASSIST: '/api/ai-assist',
  ASSISTANT: '/api/assistant',
  VOICE: '/api/voice',
  VISION: '/api/vision',
  SCHEDULE: '/api/schedule',
  JOURNAL: '/api/journal',
  MINDFULNESS: '/api/mindfulness',
  POINTS: '/api/points',
  REWARDS: '/api/rewards',
  MODERATION: '/api/moderation',
} as const;

// Voice command mappings for various app features
export const VOICE_COMMANDS = {
  NAVIGATION: {
    GO_TO: 'go to',
    OPEN: 'open',
    SHOW: 'show',
    NAVIGATE: 'navigate',
  },
  TASKS: {
    ADD: 'add task',
    COMPLETE: 'complete task',
    DELETE: 'delete task',
    LIST: 'list tasks',
  },
  HOMEWORK: {
    START: 'homework',
    HELP: 'help with',
    EXPLAIN: 'explain',
  },
  MINDFULNESS: {
    START_MEDITATION: 'start meditation',
    START_BREATHING: 'start breathing exercise',
  },
  MOOD: {
    LOG_MOOD: 'log mood',
  },
  JOURNAL: {
    NEW_ENTRY: 'new journal entry',
    GET_PROMPT: 'get journal prompt',
  },
} as const;

// Security and validation constants
export const SECURITY = {
  MAX_AUDIO_SIZE: 5 * 1024 * 1024, // Maximum audio size (5MB)
  MAX_REQUESTS_PER_MINUTE: 60, // Rate limiting for API calls
  ALLOWED_AUDIO_TYPES: ['audio/webm', 'audio/wav', 'audio/mp3'] as const, // Supported audio types
  REQUEST_TIMEOUT: 30000, // Request timeout in milliseconds (30 seconds)
} as const;
