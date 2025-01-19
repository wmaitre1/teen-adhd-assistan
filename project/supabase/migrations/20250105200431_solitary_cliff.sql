/*
  # Mindfulness Exercises Schema

  1. New Tables
    - mindfulness_exercises: Exercise definitions
      - id, title, description, duration, type, difficulty
    - exercise_sessions: User exercise completion records
      - id, user_id, exercise_id, duration, completed
    - exercise_feedback: User feedback and mood tracking
      - id, session_id, user_id, rating, mood tracking
  
  2. Security
    - Enable RLS on all tables
    - Public read access for exercises
    - User-specific access for sessions and feedback
    - Parent access for monitoring
*/

-- Mindfulness Exercises Table
CREATE TABLE mindfulness_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in seconds
  type TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercise Sessions Table
CREATE TABLE exercise_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID REFERENCES mindfulness_exercises(id),
  duration INTEGER NOT NULL, -- actual duration in seconds
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Exercise Feedback Table
CREATE TABLE exercise_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exercise_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  mood_before TEXT,
  mood_after TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_exercise_sessions_user ON exercise_sessions(user_id);
CREATE INDEX idx_exercise_sessions_exercise ON exercise_sessions(exercise_id);
CREATE INDEX idx_exercise_feedback_session ON exercise_feedback(session_id);
CREATE INDEX idx_exercise_feedback_user ON exercise_feedback(user_id);

-- Enable Row Level Security
ALTER TABLE mindfulness_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_feedback ENABLE ROW LEVEL SECURITY;

-- Mindfulness Exercises Policies
CREATE POLICY "Everyone can view exercises"
  ON mindfulness_exercises FOR SELECT
  USING (true);

-- Exercise Sessions Policies
CREATE POLICY "Users can manage their exercise sessions"
  ON exercise_sessions
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's sessions"
  ON exercise_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = exercise_sessions.user_id
    )
  );

-- Exercise Feedback Policies
CREATE POLICY "Users can manage their feedback"
  ON exercise_feedback
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's feedback"
  ON exercise_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = exercise_feedback.user_id
    )
  );

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_mindfulness_exercises_updated_at
  BEFORE UPDATE ON mindfulness_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();