import express from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';
import { supabase } from '../lib/supabase';
import { authenticateUser } from '../middleware/auth';
import { processAudioChunk, optimizeAudio } from '../utils/audioProcessing';
import { VoiceAnalyzer } from '../lib/voice/voiceAnalyzer';
import { moderateContent } from '../lib/moderation';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transcribe audio to text
router.post('/transcribe', authenticateUser, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Optimize audio before processing
    const optimizedAudio = await optimizeAudio(req.file.buffer);
    
    // Process audio in chunks if needed
    const chunks = await processAudioChunk(optimizedAudio);
    
    let transcription = '';
    for (const chunk of chunks) {
      const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: chunk,
        response_format: 'text',
        language: 'en'
      });
      transcription += response + ' ';
    }

    // Moderate the transcribed content
    const moderationResult = await moderateContent([{
      type: 'text',
      text: transcription
    }]);

    if (!moderationResult.isSafe) {
      return res.status(400).json({ error: 'Content violates safety guidelines' });
    }

    // Log the transcription
    await supabase.from('voice_interactions').insert({
      user_id: req.user.id,
      type: 'transcription',
      input_audio: req.file.originalname,
      output_text: transcription,
      metadata: {
        file_size: req.file.size,
        duration: chunks.length * 30 // 30 seconds per chunk
      }
    });

    res.json({ text: transcription.trim() });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Process voice command
router.post('/process', authenticateUser, async (req, res) => {
  try {
    const { text, context } = req.body;

    // Get user's preferences and learning style
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    // Create system prompt based on user's role and preferences
    let systemPrompt = `You are an AI assistant helping with ${
      req.user.role === 'student' ? 'homework and tasks' : 'monitoring student progress'
    }.`;

    if (userPrefs?.learning_style) {
      systemPrompt += ` User prefers ${userPrefs.learning_style} learning style.`;
    }

    // Process the command
    const analyzer = new VoiceAnalyzer(openai);
    const result = await analyzer.processCommand(text, {
      systemPrompt,
      context,
      userPreferences: userPrefs
    });

    // Log the interaction
    await supabase.from('voice_interactions').insert({
      user_id: req.user.id,
      type: 'command',
      input_text: text,
      output_text: result.command,
      metadata: {
        context,
        confidence: result.confidence
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Command processing error:', error);
    res.status(500).json({ error: 'Failed to process command' });
  }
});

// Analyze reading level
router.post('/analyze-reading', authenticateUser, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const optimizedAudio = await optimizeAudio(req.file.buffer);
    const analyzer = new VoiceAnalyzer(openai);
    
    const analysis = await analyzer.analyzeReading(optimizedAudio, {
      userId: req.user.id,
      context: req.body.context
    });

    // Log the analysis
    await supabase.from('voice_interactions').insert({
      user_id: req.user.id,
      type: 'reading_analysis',
      input_audio: req.file.originalname,
      output_text: JSON.stringify(analysis),
      metadata: {
        reading_level: analysis.level,
        fluency_score: analysis.fluency,
        comprehension_score: analysis.comprehension
      }
    });

    res.json(analysis);
  } catch (error) {
    console.error('Reading analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze reading' });
  }
});

// Get voice interaction history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('voice_interactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Failed to get voice history:', error);
    res.status(500).json({ error: 'Failed to get voice history' });
  }
});

export default router;