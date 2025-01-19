-- Create learning progress table
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    score INTEGER NOT NULL,
    time_spent INTEGER NOT NULL,
    difficulty_level TEXT NOT NULL,
    learning_style TEXT,
    feedback TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create user subject levels table
CREATE TABLE user_subject_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    subject TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, subject)
);

-- Create learning resources table
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    type TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user resource interactions table
CREATE TABLE user_resource_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    resource_id UUID REFERENCES learning_resources(id),
    interaction_type TEXT NOT NULL,
    duration INTEGER,
    completed BOOLEAN DEFAULT false,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_subject ON learning_progress(subject);
CREATE INDEX idx_user_subject_levels_user ON user_subject_levels(user_id);
CREATE INDEX idx_learning_resources_subject ON learning_resources(subject, topic);
CREATE INDEX idx_user_resource_interactions_user ON user_resource_interactions(user_id);

-- Enable RLS
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subject_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resource_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
    ON learning_progress FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own progress entries"
    ON learning_progress FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
    );

CREATE POLICY "Users can view their own levels"
    ON user_subject_levels FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can update their own levels"
    ON user_subject_levels FOR UPDATE
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
    );

CREATE POLICY "Everyone can view learning resources"
    ON learning_resources FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage learning resources"
    ON learning_resources
    USING (auth.get_role() = 'admin');

CREATE POLICY "Users can view their own interactions"
    ON user_resource_interactions FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own interactions"
    ON user_resource_interactions FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
    );

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_user_learning_style(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    style JSONB;
BEGIN
    WITH interactions AS (
        SELECT
            type,
            COUNT(*) as count,
            AVG(CASE WHEN lp.score IS NOT NULL THEN lp.score ELSE 0 END) as avg_score
        FROM user_resource_interactions uri
        LEFT JOIN learning_progress lp ON uri.user_id = lp.user_id
        WHERE uri.user_id = $1
        GROUP BY type
    )
    SELECT jsonb_build_object(
        'visual', COALESCE(MAX(CASE WHEN type = 'visual' THEN count * avg_score END), 0),
        'auditory', COALESCE(MAX(CASE WHEN type = 'auditory' THEN count * avg_score END), 0),
        'kinesthetic', COALESCE(MAX(CASE WHEN type = 'kinesthetic' THEN count * avg_score END), 0),
        'reading_writing', COALESCE(MAX(CASE WHEN type = 'reading_writing' THEN count * avg_score END), 0)
    ) INTO style
    FROM interactions;
    
    RETURN style;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating timestamps
CREATE TRIGGER update_learning_resources_updated_at
    BEFORE UPDATE ON learning_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subject_levels_updated_at
    BEFORE UPDATE ON user_subject_levels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();