/*
  # Points and Rewards System Schema
  
  1. New Tables
    - points_config: Configuration for point awards
      - id, parent_id, activity_type, points
    - points_transactions: Point earning/spending history
      - id, user_id, points, transaction_type, activity_type
    - rewards: Available rewards
      - id, parent_id, title, description, points_required
    - reward_requests: Student reward redemption requests
      - id, user_id, reward_id, status
  
  2. Security
    - Enable RLS on all tables
    - Policies for student access
    - Policies for parent access
    
  3. Dependencies
    - References auth.users for user relationships
*/

-- Points Configuration Table
CREATE TABLE points_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  points INTEGER NOT NULL CHECK (points >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_parent
    FOREIGN KEY(parent_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  UNIQUE(parent_id, activity_type)
);

-- Points Transactions Table
CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'spent')),
  activity_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Rewards Table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL CHECK (points_required > 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_parent
    FOREIGN KEY(parent_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Reward Requests Table
CREATE TABLE reward_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_reward
    FOREIGN KEY(reward_id)
    REFERENCES rewards(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_points_transactions_user ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_type ON points_transactions(transaction_type);
CREATE INDEX idx_rewards_parent ON rewards(parent_id);
CREATE INDEX idx_reward_requests_user ON reward_requests(user_id);
CREATE INDEX idx_reward_requests_status ON reward_requests(status);

-- Enable Row Level Security
ALTER TABLE points_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_requests ENABLE ROW LEVEL SECURITY;

-- Points Config Policies
CREATE POLICY "Parents can manage their points config"
  ON points_config
  USING (parent_id = auth.uid());

-- Points Transactions Policies
CREATE POLICY "Users can view their transactions"
  ON points_transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view their children's transactions"
  ON points_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = points_transactions.user_id
    )
  );

-- Rewards Policies
CREATE POLICY "Parents can manage their rewards"
  ON rewards
  USING (parent_id = auth.uid());

CREATE POLICY "Students can view available rewards"
  ON rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = rewards.parent_id
      AND child_id = auth.uid()
    )
  );

-- Reward Requests Policies
CREATE POLICY "Users can manage their reward requests"
  ON reward_requests
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view and manage their children's requests"
  ON reward_requests
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_accounts
      WHERE parent_id = auth.uid()
      AND child_id = reward_requests.user_id
    )
  );

-- Add triggers for updated_at columns
CREATE TRIGGER update_points_config_updated_at
    BEFORE UPDATE ON points_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
    BEFORE UPDATE ON rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_requests_updated_at
    BEFORE UPDATE ON reward_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();