import { OpenAIError, API_BASE_URL } from '../openai';

export class SocraticMethod {
  private context: string[];

  constructor() {
    this.context = [];
  }

  async askQuestion(topic: string, previousAnswer?: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/socratic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          previousAnswer,
          context: this.context
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to generate question: ${response.statusText}`);
      }

      const { question } = await response.json();
      this.context.push(question);
      if (previousAnswer) {
        this.context.push(previousAnswer);
      }

      return question;
    } catch (error: any) {
      throw new OpenAIError('Failed to generate Socratic question: ' + error.message, error);
    }
  }

  async evaluateAnswer(answer: string): Promise<{
    feedback: string;
    understanding: number;
    nextSteps: string[];
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/socratic/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer,
          context: this.context
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to evaluate answer: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      throw new OpenAIError('Failed to evaluate answer: ' + error.message, error);
    }
  }

  clearContext() {
    this.context = [];
  }
}