/*
  # Voice and Vision System Tables

  1. New Tables
    - voice_interactions: Track voice commands and transcriptions
    - voice_analysis: Store speech analysis results
    - vision_interactions: Track image analysis requests
    - vision_results: Store image analysis results
    
  2. Security
    - Enable RLS on all tables
    - User-specific access policies
    - Parent access for monitoring
*/

-- Voice Interactions Table
CREATE TABLE voice_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  input_audio TEXT,
  input_text TEXT,
  output_text TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Voice Analysis Table
CREATE TABLE voice_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID REFERENCES voice_interactions(id) ON DELETE CASCADE,
  fluency_score FLOAT CHECK (fluency_score BETWEEN 0 AND 1),
  pronunciation_score FLOAT CHECK (pronunciation_score BETWEEN 0 AND 1),
  comprehension_score FLOAT CHECK (comprehension_score BETWEEN 0 AND 1),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vision Interactions Table
CREATE TABLE vision_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  input_image TEXT,
  output_text TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Vision Results Table
CREATE TABLE vision_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID REFERENCES vision_interactions(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,
  confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_voice_interactions_user ON voice_interactions(user_id);
CREATE INDEX idx_voice_interactions_type ON voice_interactions(type);
CREATE INDEX idx_voice_analysis_interaction ON voice_analysis(interaction_id);
CREATE INDEX idx_vision_interactions_user ON vision_interactions(user_id);
CREATE INDEX idx_vision_interactions_type ON vision_interactions(type);
CREATE INDEX idx_vision_results_interaction ON vision_results(interaction_id);

-- Enable Row Level Security
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their voice interactions"
  ON voice_interactions
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's voice interactions"
  ON voice_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = voice_interactions.user_id
    )
  );

CREATE POLICY "Users can view their voice analysis"
  ON voice_analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM voice_interactions
      WHERE voice_interactions.id = voice_analysis.interaction_id
      AND voice_interactions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their vision interactions"
  ON vision_interactions
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's vision interactions"
  ON vision_interactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = vision_interactions.user_id
    )
  );

CREATE POLICY "Users can view their vision results"
  ON vision_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vision_interactions
      WHERE vision_interactions.id = vision_results.interaction_id
      AND vision_interactions.user_id = auth.uid()
    )
  );