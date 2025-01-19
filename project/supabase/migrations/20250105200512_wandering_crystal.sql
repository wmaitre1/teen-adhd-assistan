/*
  # Class Schedule System Schema

  1. New Tables
    - class_schedule: Student class schedules
      - id, user_id, name, teacher, times, days, room
    - schedule_notifications: Notification preferences
      - id, user_id, reminder settings, quiet hours
  
  2. Security
    - Enable RLS on all tables
    - User-specific access control
    - Parent access for viewing
*/

-- Class Schedule Table
CREATE TABLE class_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  teacher TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days TEXT[] NOT NULL,
  room TEXT,
  schedule_type TEXT CHECK (schedule_type IN ('Every Day', 'A Day', 'B Day')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Schedule Notifications Table
CREATE TABLE schedule_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  class_reminders BOOLEAN DEFAULT true,
  hour_before BOOLEAN DEFAULT true,
  fifteen_before BOOLEAN DEFAULT true,
  daily_summary BOOLEAN DEFAULT true,
  notification_style TEXT DEFAULT 'both',
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id) 
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_class_schedule_user ON class_schedule(user_id);
CREATE INDEX idx_schedule_notifications_user ON schedule_notifications(user_id);

-- Enable Row Level Security
ALTER TABLE class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_notifications ENABLE ROW LEVEL SECURITY;

-- Class Schedule Policies
CREATE POLICY "Users can manage their schedule"
  ON class_schedule
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's schedule"
  ON class_schedule FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = class_schedule.user_id
    )
  );

-- Schedule Notifications Policies
CREATE POLICY "Users can manage their notification settings"
  ON schedule_notifications
  USING (user_id = auth.uid());

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_class_schedule_updated_at
  BEFORE UPDATE ON class_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_notifications_updated_at
  BEFORE UPDATE ON schedule_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();