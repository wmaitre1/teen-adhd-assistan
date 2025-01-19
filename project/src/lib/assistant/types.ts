export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  files?: File[];
}

export interface ConversationContext {
  messages: Message[];
  files: File[];
}

export interface AssistantConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface AssistantOptions {
  onMessage?: (message: Message) => void;
  onError?: (error: Error) => void;
  onStateChange?: (isProcessing: boolean) => void;
  config?: Partial<AssistantConfig>;
}

export interface AssistantState {
  isProcessing: boolean;
  error: Error | null;
  context: ConversationContext;
} 