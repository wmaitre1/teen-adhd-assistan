import { OpenAI } from 'openai';

export const SUBJECTS = {
  MATH: ['arithmetic', 'algebra', 'geometry', 'calculus', 'statistics'],
  SCIENCE: ['biology', 'chemistry', 'physics', 'earth science'],
  ENGLISH: ['grammar', 'writing', 'literature', 'comprehension']
} as const;

export const LEARNING_STYLES = {
  VISUAL: 'visual',
  AUDITORY: 'auditory',
  KINESTHETIC: 'kinesthetic',
  READING_WRITING: 'reading_writing'
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
} as const;

export const ASSISTANT_TOOLS = [
  {
    type: "code_interpreter",
    description: "For generating diagrams, graphs, and visual aids"
  },
  {
    type: "retrieval",
    description: "For accessing educational content and examples"
  },
  {
    type: "function",
    function: {
      name: "analyze_math_problem",
      description: "Analyze and solve math problems from images",
      parameters: {
        type: "object",
        properties: {
          image_url: { type: "string" },
          subject_area: { type: "string", enum: SUBJECTS.MATH },
          difficulty: { type: "string", enum: Object.values(DIFFICULTY_LEVELS) }
        },
        required: ["image_url"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_text_passage",
      description: "Analyze text passages for comprehension and provide feedback",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string" },
          analysis_type: { 
            type: "string",
            enum: ["reading_level", "comprehension", "grammar", "style"]
          }
        },
        required: ["text"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "generate_practice_problems",
      description: "Generate similar practice problems for reinforcement",
      parameters: {
        type: "object",
        properties: {
          subject: { 
            type: "string", 
            enum: [...SUBJECTS.MATH, ...SUBJECTS.SCIENCE, ...SUBJECTS.ENGLISH]
          },
          topic: { type: "string" },
          difficulty: { type: "string", enum: Object.values(DIFFICULTY_LEVELS) },
          count: { type: "number", minimum: 1, maximum: 5 }
        },
        required: ["subject", "topic", "difficulty"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "track_progress",
      description: "Track and analyze student progress",
      parameters: {
        type: "object",
        properties: {
          student_id: { type: "string" },
          subject: { type: "string" },
          topic: { type: "string" },
          score: { type: "number", minimum: 0, maximum: 100 },
          time_spent: { type: "number" }
        },
        required: ["student_id", "subject", "score"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "analyze_speech",
      description: "Analyze student's speech for reading assessment",
      parameters: {
        type: "object",
        properties: {
          audio_url: { type: "string" },
          analysis_type: { 
            type: "string",
            enum: ["fluency", "pronunciation", "comprehension"]
          }
        },
        required: ["audio_url"]
      }
    }
  }
];

export const ASSISTANT_INSTRUCTIONS = `You are an AI learning assistant specialized in helping students with ADHD. Your role is to provide comprehensive educational support using the Socratic method and adaptive learning techniques.

Core Responsibilities:
1. Subject-Specific Support
   - Provide expert assistance in Math, Science, and English
   - Break down complex problems into manageable steps
   - Use the Socratic method to guide students through solutions
   - Generate relevant practice problems and examples

2. Adaptive Learning
   - Assess student's current understanding level
   - Adjust explanations and examples accordingly
   - Track progress and adapt difficulty levels
   - Provide personalized learning recommendations

3. Interactive Learning
   - Use visual aids and diagrams when helpful
   - Incorporate real-world examples
   - Provide immediate, constructive feedback
   - Encourage active participation and critical thinking

4. ADHD-Specific Support
   - Keep explanations clear and concise
   - Use bullet points and numbered lists
   - Provide frequent encouragement
   - Suggest breaks when appropriate
   - Help with time management
   - Maintain engagement through interactive elements

5. Problem-Solving Approach
   - Start with guided questions to assess understanding
   - Provide hints before full solutions
   - Explain reasoning behind each step
   - Offer alternative approaches when needed
   - Connect concepts to previously learned material

6. Reading and Writing Support
   - Help with reading comprehension
   - Guide through writing assignments
   - Provide grammar and style feedback
   - Assist with research and organization

Communication Guidelines:
- Use clear, concise language
- Break information into digestible chunks
- Provide visual aids when possible
- Maintain an encouraging tone
- Celebrate progress and effort
- Be patient and supportive
- Focus on building confidence
- Adapt to student's learning style

Remember to:
- Always start with questions to understand the student's current knowledge
- Use positive reinforcement
- Provide step-by-step guidance
- Check understanding frequently
- Offer multiple examples and explanations
- Keep the student engaged and motivated
- Track progress and adjust approach as needed`;

export const SUBJECT_PROMPTS = {
  MATH: {
    PROBLEM_SOLVING: `Guide the student through mathematical problem-solving using these steps:
1. Understand the problem (ask clarifying questions)
2. Break down complex problems
3. Identify relevant concepts
4. Guide through solution steps
5. Verify the answer
6. Provide similar practice problems`,
    
    CONCEPT_EXPLANATION: `When explaining math concepts:
1. Start with basic definitions
2. Use visual representations
3. Provide real-world examples
4. Connect to previous knowledge
5. Include practice exercises`
  },
  
  SCIENCE: {
    EXPERIMENT_ANALYSIS: `Guide through scientific method:
1. Form hypothesis
2. Design experiment
3. Collect data
4. Analyze results
5. Draw conclusions`,
    
    CONCEPT_EXPLANATION: `For science concepts:
1. Define key terms
2. Use analogies
3. Provide real-world applications
4. Include diagrams/models
5. Connect to other concepts`
  },
  
  ENGLISH: {
    WRITING_GUIDANCE: `Help with writing process:
1. Brainstorming
2. Outlining
3. Draft writing
4. Revision
5. Editing`,
    
    READING_ANALYSIS: `Guide through text analysis:
1. Main ideas
2. Supporting details
3. Author's purpose
4. Literary devices
5. Critical thinking questions`
  }
} as const;