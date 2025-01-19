import { Router } from 'express';
import multer from 'multer';
import { openai, OpenAIError } from '../lib/openai';
import { File } from 'buffer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Transcribe audio to text
router.post('/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Convert buffer to File object
    const audioFile = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype,
    });

    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: 'text'
    });

    res.send(transcription);
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    });
  }
});

// Translate audio to English
router.post('/translate', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Convert buffer to File object
    const audioFile = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype,
    });

    const translation = await openai.audio.translations.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: 'text'
    });

    res.send(translation);
  } catch (error: any) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate audio',
      details: error.message 
    });
  }
});

// Process voice commands
router.post('/process-voice', async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: 'No text provided' });
    }

    let systemPrompt = "You are an AI assistant helping with task management and homework.";
    
    if (context?.productNames?.length) {
      systemPrompt += ` The following product names should be spelled correctly: ${context.productNames.join(', ')}.`;
    }
    
    if (context?.customTerms?.length) {
      systemPrompt += ` The following terms should be spelled correctly: ${context.customTerms.join(', ')}.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError('No response content received from OpenAI');
    }

    res.json({ content });
  } catch (error: any) {
    console.error('Voice processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process voice command',
      details: error.message 
    });
  }
});

export default router; 