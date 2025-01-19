-- Create learning interactions table
CREATE TABLE learning_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    problem_id TEXT,
    interaction_type TEXT NOT NULL,
    content TEXT NOT NULL,
    response TEXT,
    hints_used INTEGER DEFAULT 0,
    time_spent INTEGER,
    is_correct BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create problem bank table
CREATE TABLE problem_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    concepts TEXT[],
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_learning_interactions_user ON learning_interactions(user_id);
CREATE INDEX idx_learning_interactions_subject ON learning_interactions(subject, topic);
CREATE INDEX idx_problem_bank_subject ON problem_bank(subject, topic);
CREATE INDEX idx_problem_bank_difficulty ON problem_bank(difficulty);

-- Enable RLS
ALTER TABLE learning_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_bank ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own interactions"
    ON learning_interactions FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own interactions"
    ON learning_interactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view problems"
    ON problem_bank FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage problems"
    ON problem_bank
    USING (auth.get_role() = 'admin');

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_learning_stats(user_id UUID)
RETURNS TABLE (
    subject TEXT,
    total_interactions INTEGER,
    correct_answers INTEGER,
    avg_hints_used FLOAT,
    avg_time_spent INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        li.subject,
        COUNT(*) as total_interactions,
        COUNT(*) FILTER (WHERE li.is_correct) as correct_answers,
        AVG(li.hints_used)::FLOAT as avg_hints_used,
        AVG(li.time_spent)::INTEGER as avg_time_spent
    FROM learning_interactions li
    WHERE li.user_id = user_id
    GROUP BY li.subject;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;