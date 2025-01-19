import { OpenAIError, API_BASE_URL } from '../openai';
import type { Message } from './types';

export class SubjectAssistant {
  private messages: Message[] = [];
  private subject: string;

  constructor(subject: string) {
    this.subject = subject;
    this.messages = [{
      role: 'system',
      content: `You are a knowledgeable tutor specializing in ${subject}. 
      Help students understand concepts clearly, provide examples, and guide problem-solving.
      Break down complex topics into manageable parts and encourage active learning.`
    }];
  }

  async askQuestion(question: string): Promise<string> {
    try {
      this.messages.push({
        role: 'user',
        content: question
      });

      const response = await fetch(`${API_BASE_URL}/api/subject-assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: this.subject,
          messages: this.messages
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`);
      }

      const { content } = await response.json();
      
      if (!content) {
        throw new Error('No response received from assistant');
      }

      this.messages.push({
        role: 'assistant',
        content
      });

      return content;
    } catch (error: any) {
      throw new OpenAIError('Failed to get subject assistance: ' + error.message, error);
    }
  }

  async explainConcept(concept: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subject-assist/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: this.subject,
          concept,
          messages: this.messages
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to get explanation: ${response.statusText}`);
      }

      const { content } = await response.json();
      
      if (!content) {
        throw new Error('No explanation received');
      }

      this.messages.push({
        role: 'assistant',
        content
      });

      return content;
    } catch (error: any) {
      throw new OpenAIError('Failed to explain concept: ' + error.message, error);
    }
  }

  clearContext() {
    const systemMessage = this.messages[0];
    this.messages = systemMessage ? [systemMessage] : [];
  }
}