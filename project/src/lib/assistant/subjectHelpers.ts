import { OpenAI } from 'openai';
import { SUBJECTS, SUBJECT_PROMPTS } from './assistantConfig';

export class SubjectHelper {
  static async analyzeMathProblem(openai: OpenAI, imageUrl: string, context: {
    topic?: string;
    difficulty?: string;
  } = {}) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: SUBJECT_PROMPTS.MATH.PROBLEM_SOLVING
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this math problem and provide step-by-step guidance."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }

  static async generateSimilarProblems(openai: OpenAI, {
    subject,
    topic,
    difficulty,
    originalProblem
  }: {
    subject: keyof typeof SUBJECTS;
    topic: string;
    difficulty: string;
    originalProblem: string;
  }) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate similar practice problems for ${subject} topic: ${topic} at ${difficulty} level.`
        },
        {
          role: "user",
          content: `Original problem: ${originalProblem}\nGenerate 3 similar problems with solutions.`
        }
      ],
      temperature: 0.7
    });

    return response.choices[0].message.content;
  }

  static async analyzeReadingPassage(openai: OpenAI, text: string, analysisType: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SUBJECT_PROMPTS.ENGLISH.READING_ANALYSIS
        },
        {
          role: "user",
          content: `Analyze this text passage for ${analysisType}:\n\n${text}`
        }
      ]
    });

    return response.choices[0].message.content;
  }

  static async provideWritingFeedback(openai: OpenAI, text: string, type: 'structure' | 'grammar' | 'style') {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SUBJECT_PROMPTS.ENGLISH.WRITING_GUIDANCE
        },
        {
          role: "user",
          content: `Please provide ${type} feedback for this text:\n\n${text}`
        }
      ]
    });

    return response.choices[0].message.content;
  }

  static async explainScientificConcept(openai: OpenAI, concept: string, level: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: SUBJECT_PROMPTS.SCIENCE.CONCEPT_EXPLANATION
        },
        {
          role: "user",
          content: `Explain the concept of ${concept} at a ${level} level.`
        }
      ]
    });

    return response.choices[0].message.content;
  }
}