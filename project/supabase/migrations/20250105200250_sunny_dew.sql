/*
  # Homework Management System Schema
  
  1. New Tables
    - homework_assignments: Core assignments table
      - id, user_id, subject, title, description, due_date, completed, etc.
    - homework_subjects: Subject configuration
      - id, user_id, subject, color
    - homework_submissions: Assignment submissions
      - id, assignment_id, user_id, content, file_urls, grade
  
  2. Security
    - Enable RLS on all tables
    - Policies for student access
    - Policies for parent access
    
  3. Dependencies
    - Requires users table from previous migration
*/

-- Create type for schedule types if not exists
DO $$ BEGIN
    CREATE TYPE schedule_type AS ENUM ('Every Day', 'A Day', 'B Day');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Homework Assignments Table
CREATE TABLE IF NOT EXISTS homework_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  teacher_name TEXT,
  schedule_type schedule_type DEFAULT 'Every Day',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Homework Subjects Table
CREATE TABLE IF NOT EXISTS homework_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_user_subject UNIQUE(user_id, subject)
);

-- Homework Submissions Table
CREATE TABLE IF NOT EXISTS homework_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT,
  file_urls TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT now(),
  grade NUMERIC CHECK (grade >= 0 AND grade <= 100),
  CONSTRAINT fk_assignment
    FOREIGN KEY(assignment_id)
    REFERENCES homework_assignments(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_homework_assignments_user ON homework_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_homework_assignments_due_date ON homework_assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_assignment ON homework_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_homework_subjects_user ON homework_subjects(user_id);

-- Enable Row Level Security
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

-- Homework Assignments Policies
CREATE POLICY "Users can view own assignments"
  ON homework_assignments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own assignments"
  ON homework_assignments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assignments"
  ON homework_assignments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own assignments"
  ON homework_assignments FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view children's assignments"
  ON homework_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = homework_assignments.user_id
    )
  );

-- Homework Subjects Policies
CREATE POLICY "Users can view own subjects"
  ON homework_subjects FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own subjects"
  ON homework_subjects FOR ALL
  USING (user_id = auth.uid());

-- Homework Submissions Policies
CREATE POLICY "Users can view own submissions"
  ON homework_submissions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own submissions"
  ON homework_submissions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view children's submissions"
  ON homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = homework_submissions.user_id
    )
  );

-- Create or update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_homework_assignments_updated_at ON homework_assignments;
CREATE TRIGGER update_homework_assignments_updated_at
    BEFORE UPDATE ON homework_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();