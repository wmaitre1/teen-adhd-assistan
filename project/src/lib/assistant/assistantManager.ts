import type { User } from '../../types';
import type { Message, AssistantConfig, AssistantOptions, AssistantState } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ConversationContext {
  page?: string;
  userRole?: string;
  subject?: string;
  task?: string;
}

export class AssistantManager {
  private static instance: AssistantManager;
  private messages: Message[] = [];
  private user: User | null = null;

  private constructor() {}

  static getInstance(): AssistantManager {
    if (!AssistantManager.instance) {
      AssistantManager.instance = new AssistantManager();
    }
    return AssistantManager.instance;
  }

  async initializeAssistant(user: User) {
    try {
      this.user = user;
      this.messages = [{
        role: 'system',
        content: `You are an AI assistant helping ${user.name}, a student with ADHD. 
        Your goal is to provide clear, structured assistance with tasks, homework, and organization.
        Keep responses concise and break information into manageable chunks.
        Use positive reinforcement and encourage good study habits.`
      }];
    } catch (error) {
      console.error('Failed to initialize assistant:', error);
      throw error;
    }
  }

  async startConversation(context: ConversationContext = {}) {
    try {
      const contextMessage = `Current context: ${Object.entries(context)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')}`;
      
      this.messages.push({
        role: 'system',
        content: contextMessage
      });

      return true;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  }

  async sendMessage(message: string, files?: File[]) {
    try {
      if (!this.user) {
        throw new Error('Assistant not initialized');
      }

      // Handle file attachments if needed
      let fileContent = '';
      if (files?.length) {
        // TODO: Implement file handling
        fileContent = '\n[File attachments are not yet supported]';
      }

      this.messages.push({
        role: 'user',
        content: message + fileContent
      });

      const response = await fetch(`${API_BASE_URL}/api/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          context: {
            type: 'chat',
            messages: this.messages,
            user: {
              name: this.user.name,
              role: this.user.role
            }
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`);
      }

      const { content: assistantMessage } = await response.json();
      
      if (!assistantMessage) {
        throw new Error('No response received from assistant');
      }

      this.messages.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  clearConversation() {
    const systemMessage = this.messages[0];
    this.messages = systemMessage ? [systemMessage] : [];
  }
}