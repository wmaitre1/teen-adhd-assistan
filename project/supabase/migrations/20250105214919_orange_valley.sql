/*
  # AI and Library System Tables

  1. New Tables
    - ai_conversations: Track AI assistant interactions
    - ai_learning_patterns: Store detected learning patterns
    - ai_emotional_patterns: Track emotional analysis
    - ai_suggestions: Store AI-generated suggestions
    - ai_feedback: User feedback on AI interactions
    
  2. Security
    - Enable RLS on all tables
    - User-specific access policies
    - Parent access for viewing children's data
*/

-- AI Conversations Table
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  context TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  metadata JSONB,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- AI Learning Patterns Table
CREATE TABLE ai_learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  style TEXT NOT NULL,
  effectiveness_score FLOAT CHECK (effectiveness_score BETWEEN 0 AND 1),
  detected_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- AI Emotional Patterns Table
CREATE TABLE ai_emotional_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pattern_type TEXT NOT NULL,
  confidence FLOAT CHECK (confidence BETWEEN 0 AND 1),
  detected_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- AI Suggestions Table
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  context JSONB,
  acted_on BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- AI Feedback Table
CREATE TABLE ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  suggestion_id UUID REFERENCES ai_suggestions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_learning_patterns_user ON ai_learning_patterns(user_id);
CREATE INDEX idx_ai_emotional_patterns_user ON ai_emotional_patterns(user_id);
CREATE INDEX idx_ai_suggestions_user ON ai_suggestions(user_id);
CREATE INDEX idx_ai_feedback_suggestion ON ai_feedback(suggestion_id);

-- Enable Row Level Security
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_emotional_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own AI data"
  ON ai_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's AI data"
  ON ai_conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = ai_conversations.user_id
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can view their learning patterns"
  ON ai_learning_patterns FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's learning patterns"
  ON ai_learning_patterns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = ai_learning_patterns.user_id
    )
  );

CREATE POLICY "Users can view their emotional patterns"
  ON ai_emotional_patterns FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's emotional patterns"
  ON ai_emotional_patterns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = ai_emotional_patterns.user_id
    )
  );

CREATE POLICY "Users can manage their AI suggestions"
  ON ai_suggestions
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their AI feedback"
  ON ai_feedback
  USING (user_id = auth.uid());