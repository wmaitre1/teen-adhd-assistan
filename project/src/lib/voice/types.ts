export interface VoiceCommand {
  type: 'navigation' | 'action';
  route?: string;
  functionCall?: {
    name: string;
    parameters: Record<string, any>;
  };
}

export interface VoiceManagerOptions {
  onCommand?: (command: VoiceCommand) => void;
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
}

export interface VoiceState {
  isListening: boolean;
  isInitialized: boolean;
  error: Error | null;
  transcript: string | null;
}

export interface NavigationCommand {
  routeName: string;
  route: string;
  aliases: string[];
}

export interface NavigationCommands {
  [key: string]: NavigationCommand;
}

export interface VoiceCommandResult {
  type: 'navigation' | 'action' | 'error';
  route?: string;
  functionCall?: {
    name: string;
    parameters: Record<string, any>;
  };
  error?: string;
} 