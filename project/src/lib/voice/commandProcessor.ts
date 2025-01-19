import { navigationCommands, findNavigationCommand } from './navigationCommands';
import { VOICE_COMMANDS } from '../constants';

interface CommandResult {
  type: 'navigation' | 'action' | 'error';
  route?: string;
  routeName?: string;
  functionCall?: {
    name: string;
    parameters: Record<string, any>;
  };
  feedback?: string;
  error?: string;
}

interface CommandContext {
  currentPage?: string;
  userRole?: string;
  previousCommands?: string[];
}

export class CommandProcessor {
  static async processCommand(
    text: string,
    context?: CommandContext
  ): Promise<CommandResult> {
    try {
      console.log('Processing command:', text, context);
      
      if (!text?.trim()) {
        return {
          type: 'error',
          error: 'Empty command',
          feedback: "I didn't hear anything. Please try again."
        };
      }

      const normalizedText = text.toLowerCase().trim();
      console.log('Normalized text:', normalizedText);

      // Check for form opening commands first
      if (this.isFormOpenCommand(normalizedText)) {
        return this.handleFormOpenCommand(normalizedText);
      }

      // Check for form field input commands
      if (this.isFormInputCommand(normalizedText)) {
        return this.handleFormInputCommand(normalizedText);
      }

      // Check for mindfulness commands
      if (this.isMindfulnessCommand(normalizedText)) {
        return this.handleMindfulnessCommand(normalizedText);
      }

      // Check for navigation commands
      const navigationCommand = findNavigationCommand(normalizedText);
      if (navigationCommand) {
        return {
          type: 'navigation',
          route: navigationCommand.route,
          routeName: navigationCommand.routeName,
          feedback: `Navigating to ${navigationCommand.routeName}`
        };
      }

      // If no command matched
      return {
        type: 'error',
        error: 'Command not recognized',
        feedback: "I didn't understand that command. Please try again."
      };
    } catch (error) {
      console.error('Command processing error:', error);
      return {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        feedback: "Sorry, I had trouble processing that command. Please try again."
      };
    }
  }

  private static isFormOpenCommand(text: string): boolean {
    const formOpenPatterns = [
      /add task/i,
      /new task/i,
      /create task/i,
      /add assignment/i,
      /new assignment/i,
      /add homework/i,
      /new homework/i,
      /new journal/i,
      /add journal/i
    ];
    return formOpenPatterns.some(pattern => pattern.test(text));
  }

  private static handleFormOpenCommand(text: string): CommandResult {
    // Task form
    if (/(?:add|new|create)\s+task/i.test(text)) {
      return {
        type: 'action',
        functionCall: {
          name: 'openTaskForm',
          parameters: {}
        },
        feedback: 'Opening task form. What would you like to add?'
      };
    }

    // Homework/Assignment form
    if (/(?:add|new)\s+(?:homework|assignment)/i.test(text)) {
      return {
        type: 'action',
        functionCall: {
          name: 'openHomeworkForm',
          parameters: {}
        },
        feedback: 'Opening homework form. What assignment would you like to add?'
      };
    }

    // Journal form
    if (/(?:add|new)\s+journal/i.test(text)) {
      return {
        type: 'action',
        functionCall: {
          name: 'openJournalForm',
          parameters: {}
        },
        feedback: 'Opening journal form. What would you like to write about?'
      };
    }

    return {
      type: 'error',
      error: 'Invalid form command',
      feedback: 'Please specify which form you want to open'
    };
  }

  private static isFormInputCommand(text: string): boolean {
    // Add patterns for form field input commands
    const formInputPatterns = [
      /set title/i,
      /set description/i,
      /set date/i,
      /set time/i,
      /set subject/i,
      /set priority/i,
      /add tag/i
    ];
    return formInputPatterns.some(pattern => pattern.test(text));
  }

  private static handleFormInputCommand(text: string): CommandResult {
    // Extract field and value from command
    const titleMatch = text.match(/set title\s+(?:to\s+)?(.+)/i);
    if (titleMatch) {
      return {
        type: 'action',
        functionCall: {
          name: 'setFormField',
          parameters: {
            field: 'title',
            value: titleMatch[1].trim()
          }
        },
        feedback: `Setting title to: ${titleMatch[1].trim()}`
      };
    }

    const descriptionMatch = text.match(/set description\s+(?:to\s+)?(.+)/i);
    if (descriptionMatch) {
      return {
        type: 'action',
        functionCall: {
          name: 'setFormField',
          parameters: {
            field: 'description',
            value: descriptionMatch[1].trim()
          }
        },
        feedback: `Setting description to: ${descriptionMatch[1].trim()}`
      };
    }

    // Add more field handlers as needed

    return {
      type: 'error',
      error: 'Invalid form input',
      feedback: 'Please specify what field you want to set'
    };
  }

  private static isMindfulnessCommand(text: string): boolean {
    const mindfulnessPatterns = [
      /quick meditation/i,
      /start meditation/i,
      /begin meditation/i,
      /breathing exercise/i,
      /start breathing/i
    ];
    return mindfulnessPatterns.some(pattern => pattern.test(text));
  }

  private static handleMindfulnessCommand(text: string): CommandResult {
    if (text.includes('meditation')) {
      return {
        type: 'action',
        functionCall: {
          name: 'startMeditation',
          parameters: {}
        },
        feedback: 'Starting meditation session'
      };
    }
    
    if (text.includes('breathing')) {
      return {
        type: 'action',
        functionCall: {
          name: 'startBreathing',
          parameters: {}
        },
        feedback: 'Starting breathing exercise'
      };
    }

    return {
      type: 'error',
      error: 'Invalid mindfulness command',
      feedback: 'Please specify which mindfulness exercise you want to start'
    };
  }
}