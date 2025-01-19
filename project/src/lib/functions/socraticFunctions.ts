import { SocraticMethod } from '../learning/SocraticMethod';

export const socraticFunctions = {
  generateQuestion: async (data: {
    subject: string;
    topic: string;
    previousResponses?: string[];
  }) => {
    const socraticMethod = new SocraticMethod();
    const question = await socraticMethod.generateInitialQuestion(
      data.topic,
      `Subject: ${data.subject}`
    );
    return question;
  }
};