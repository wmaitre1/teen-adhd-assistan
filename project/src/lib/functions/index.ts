export * from './voiceFunctions';
export * from './formFunctions';
export * from './socraticFunctions';
export * from './taskFunctions';

// Function registry for all available functions
export const functionRegistry = {
  // Voice Functions
  processVoiceCommand: {
    name: "processVoiceCommand",
    description: "Process voice input and execute corresponding commands",
    parameters: {
      type: "object",
      properties: {
        audioBlob: { type: "string", format: "binary" },
        context: {
          type: "object",
          properties: {
            currentPage: { type: "string" },
            userRole: { type: "string" },
            previousCommands: { type: "array", items: { type: "string" } }
          }
        }
      },
      required: ["audioBlob"]
    }
  },

  // Form Functions
  submitHomeworkForm: {
    name: "submitHomeworkForm",
    description: "Submit homework assignment form",
    parameters: {
      type: "object",
      properties: {
        subject: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        dueDate: { type: "string", format: "date-time" },
        teacherName: { type: "string" },
        scheduleType: { type: "string", enum: ["Every Day", "A Day", "B Day"] }
      },
      required: ["subject", "title", "dueDate"]
    }
  },

  submitJournalEntry: {
    name: "submitJournalEntry",
    description: "Submit journal entry form",
    parameters: {
      type: "object",
      properties: {
        content: { type: "string" },
        mood: {
          type: "object",
          properties: {
            emoji: { type: "string" },
            label: { type: "string" },
            value: { type: "number" }
          }
        },
        tags: { type: "array", items: { type: "string" } }
      },
      required: ["content", "mood"]
    }
  },

  submitMindfulnessExercise: {
    name: "submitMindfulnessExercise",
    description: "Submit mindfulness exercise feedback",
    parameters: {
      type: "object",
      properties: {
        exerciseId: { type: "string" },
        rating: { type: "number", minimum: 1, maximum: 5 },
        moodChange: { type: "string", enum: ["better", "same", "worse"] },
        notes: { type: "string" }
      },
      required: ["exerciseId", "rating"]
    }
  },

  // Socratic Functions
  generateQuestion: {
    name: "generateQuestion",
    description: "Generate a Socratic question for learning",
    parameters: {
      type: "object",
      properties: {
        subject: { type: "string" },
        topic: { type: "string" },
        previousResponses: { type: "array", items: { type: "string" } }
      },
      required: ["subject", "topic"]
    }
  },

  // Task Functions
  createTask: {
    name: "createTask",
    description: "Create a new task via voice command",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        dueDate: { type: "string", format: "date-time" },
        priority: { type: "string", enum: ["high", "medium", "low"] },
        tags: { type: "array", items: { type: "string" } }
      },
      required: ["title"]
    }
  }
};