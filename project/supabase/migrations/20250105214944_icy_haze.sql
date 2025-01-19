/*
  # Privacy and Settings System Tables

  1. New Tables
    - privacy_settings: User privacy preferences
    - user_settings: General user settings
    - data_export_requests: GDPR data export tracking
    - consent_logs: Privacy consent tracking
    
  2. Security
    - Enable RLS on all tables
    - Strict user-specific access
    - Parent access for children's settings
*/

-- Privacy Settings Table
CREATE TABLE privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  data_sharing BOOLEAN DEFAULT false,
  analytics_enabled BOOLEAN DEFAULT true,
  third_party_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- User Settings Table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system',
  font_size TEXT DEFAULT 'medium',
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  distraction_free_mode BOOLEAN DEFAULT false,
  color_blind_mode BOOLEAN DEFAULT false,
  high_contrast_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Data Export Requests Table
CREATE TABLE data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Consent Logs Table
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_privacy_settings_user ON privacy_settings(user_id);
CREATE INDEX idx_user_settings_user ON user_settings(user_id);
CREATE INDEX idx_data_export_requests_user ON data_export_requests(user_id);
CREATE INDEX idx_consent_logs_user ON consent_logs(user_id);

-- Enable Row Level Security
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their privacy settings"
  ON privacy_settings
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's privacy settings"
  ON privacy_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = privacy_settings.user_id
    )
  );

CREATE POLICY "Users can manage their settings"
  ON user_settings
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's settings"
  ON user_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = user_settings.user_id
    )
  );

CREATE POLICY "Users can manage their data export requests"
  ON data_export_requests
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their consent logs"
  ON consent_logs FOR SELECT
  USING (user_id = auth.uid());

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_privacy_settings_updated_at
    BEFORE UPDATE ON privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();