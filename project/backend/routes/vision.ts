import express from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';
import { supabase } from '../lib/supabase';
import { authenticateUser } from '../middleware/auth';
import { optimizeImage } from '../utils/imageProcessing';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze math problem
router.post('/math', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const optimizedImage = await optimizeImage(req.file.buffer);
    const base64Image = optimizedImage.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful math tutor. Analyze the math problem in the image and provide a detailed solution with steps."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please solve this math problem step by step."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    // Log the interaction
    await supabase.from('vision_interactions').insert({
      user_id: req.user.id,
      type: 'math',
      input_image: req.file.originalname,
      output: response.choices[0].message.content,
      tokens_used: response.usage?.total_tokens || 0
    });

    // Parse the response into problem, solution, and steps
    const content = response.choices[0].message.content || '';
    const [problem, ...solutionSteps] = content.split('\n').filter(Boolean);

    res.json({
      problem,
      solution: solutionSteps[solutionSteps.length - 1],
      steps: solutionSteps.slice(0, -1)
    });
  } catch (error) {
    console.error('Math analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze math problem' });
  }
});

// Process schedule image
router.post('/schedule', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const optimizedImage = await optimizeImage(req.file.buffer);
    const base64Image = optimizedImage.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Extract class schedule information from the image. Return the data in a structured format with class names, times, days, and locations."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract the schedule information from this image."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    // Log the interaction
    await supabase.from('vision_interactions').insert({
      user_id: req.user.id,
      type: 'schedule',
      input_image: req.file.originalname,
      output: response.choices[0].message.content,
      tokens_used: response.usage?.total_tokens || 0
    });

    // Parse the schedule data
    const scheduleData = JSON.parse(response.choices[0].message.content || '[]');

    res.json({ schedule: scheduleData });
  } catch (error) {
    console.error('Schedule processing error:', error);
    res.status(500).json({ error: 'Failed to process schedule' });
  }
});

// Analyze text (reading passages, etc.)
router.post('/text', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const optimizedImage = await optimizeImage(req.file.buffer);
    const base64Image = optimizedImage.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "Analyze the text in the image. Provide reading level assessment, main ideas, key vocabulary, and learning suggestions."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this text passage."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    // Log the interaction
    await supabase.from('vision_interactions').insert({
      user_id: req.user.id,
      type: 'text',
      input_image: req.file.originalname,
      output: response.choices[0].message.content,
      tokens_used: response.usage?.total_tokens || 0
    });

    // Parse the analysis
    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    res.json(analysis);
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze text' });
  }
});

export default router;