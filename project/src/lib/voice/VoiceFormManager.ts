import { VoiceFeedback } from './VoiceFeedback';

interface FormField {
  name: string;
  type: 'text' | 'date' | 'select' | 'time';
  value: string;
  options?: string[];
  required?: boolean;
}

interface FormState {
  formType: 'task' | 'homework' | 'journal' | 'mood' | 'mindfulness';
  currentField: number;
  fields: FormField[];
  values: Record<string, any>;
}

export class VoiceFormManager {
  private static instance: VoiceFormManager | null = null;
  private voiceFeedback: VoiceFeedback;
  private currentForm: FormState | null = null;

  private constructor() {
    this.voiceFeedback = VoiceFeedback.getInstance();
  }

  static getInstance(): VoiceFormManager {
    if (!VoiceFormManager.instance) {
      VoiceFormManager.instance = new VoiceFormManager();
    }
    return VoiceFormManager.instance;
  }

  async startForm(formType: FormState['formType']) {
    this.currentForm = {
      formType,
      currentField: 0,
      fields: this.getFormFields(formType),
      values: {}
    };

    await this.promptCurrentField();
  }

  async handleInput(text: string): Promise<boolean> {
    if (!this.currentForm) return false;

    const field = this.currentForm.fields[this.currentForm.currentField];
    const value = this.processInput(text, field);

    if (value !== null) {
      this.currentForm.values[field.name] = value;
      await this.voiceFeedback.speak(`Got it. ${field.name} set to ${value}.`);

      if (this.currentForm.currentField < this.currentForm.fields.length - 1) {
        this.currentForm.currentField++;
        await this.promptCurrentField();
        return true;
      } else {
        // Form is complete
        const values = this.currentForm.values;
        this.currentForm = null;
        window.dispatchEvent(new CustomEvent(`submit${this.capitalizeFirst(formType)}Form`, {
          detail: { values }
        }));
        await this.voiceFeedback.speak('Form completed. Submitting now.');
        return false;
      }
    }

    await this.voiceFeedback.speak("I didn't understand that. Please try again.");
    return true;
  }

  private async promptCurrentField() {
    if (!this.currentForm) return;

    const field = this.currentForm.fields[this.currentForm.currentField];
    let prompt = `What's the ${field.name}?`;

    if (field.type === 'select' && field.options) {
      prompt += ` Options are: ${field.options.join(', ')}`;
    }

    await this.voiceFeedback.speak(prompt);
  }

  private getFormFields(formType: FormState['formType']): FormField[] {
    switch (formType) {
      case 'homework':
        return [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'subject', type: 'select', required: true, options: ['Math', 'Science', 'English', 'History'] },
          { name: 'scheduleType', type: 'select', required: true, options: ['Every Day', 'A Day', 'B Day'] },
          { name: 'teacherName', type: 'text' },
          { name: 'dueDate', type: 'date', required: true }
        ];

      case 'task':
        return [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'dueDate', type: 'date', required: true },
          { name: 'priority', type: 'select', required: true, options: ['high', 'medium', 'low'] }
        ];

      case 'journal':
        return [
          { name: 'mood', type: 'select', required: true, options: ['happy', 'calm', 'neutral', 'worried', 'sad'] },
          { name: 'content', type: 'text', required: true }
        ];

      case 'mindfulness':
        return [
          { name: 'rating', type: 'select', required: true, options: ['1', '2', '3', '4', '5'] },
          { name: 'moodChange', type: 'select', required: true, options: ['better', 'same', 'worse'] },
          { name: 'notes', type: 'text' }
        ];

      default:
        return [];
    }
  }

  private processInput(text: string, field: FormField): any {
    const normalizedText = text.toLowerCase().trim();

    switch (field.type) {
      case 'select':
        if (!field.options) return null;
        return field.options.find(opt => 
          normalizedText === opt.toLowerCase() ||
          normalizedText.includes(opt.toLowerCase())
        ) || null;

      case 'date':
        // Handle relative dates
        if (normalizedText.includes('tomorrow')) {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          return date.toISOString();
        }
        if (normalizedText.includes('next week')) {
          const date = new Date();
          date.setDate(date.getDate() + 7);
          return date.toISOString();
        }
        // Add more date parsing logic as needed
        return null;

      case 'text':
        return text.trim() || null;

      default:
        return null;
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isFormActive(): boolean {
    return this.currentForm !== null;
  }

  getCurrentFormType(): FormState['formType'] | null {
    return this.currentForm?.formType || null;
  }
}