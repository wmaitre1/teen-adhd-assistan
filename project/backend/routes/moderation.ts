import express from 'express';
import { OpenAI } from 'openai';
import { authenticateUser } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/check', authenticateUser, async (req, res) => {
  try {
    const { model, input } = req.body;

    const response = await openai.moderations.create({
      model,
      input
    });

    // Log moderation check
    await supabase.from('moderation_logs').insert({
      user_id: req.user.id,
      input: input,
      result: response,
      flagged: response.results[0].flagged
    });

    // If content is flagged and user is a student, notify parent
    if (response.results[0].flagged && req.user.role === 'student') {
      // Get parent information
      const { data: parentRelation } = await supabase
        .from('parent_student_relationships')
        .select('parent:users!parent_id(id, email)')
        .eq('student_id', req.user.id)
        .single();

      if (parentRelation?.parent) {
        // Create notification for parent
        await supabase.from('notifications').insert({
          user_id: parentRelation.parent.id,
          type: 'content_warning',
          content: {
            student_id: req.user.id,
            student_name: req.user.name,
            categories: Object.entries(response.results[0].categories)
              .filter(([_, flagged]) => flagged)
              .map(([category]) => category)
          }
        });
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Moderation check failed:', error);
    res.status(500).json({ error: 'Failed to check content' });
  }
});

export default router;