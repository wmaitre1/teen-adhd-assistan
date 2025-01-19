-- Create voice interactions table
CREATE TABLE voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT NOT NULL,
    input_audio TEXT,
    input_text TEXT,
    output_text TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reading analysis table
CREATE TABLE reading_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    interaction_id UUID REFERENCES voice_interactions(id),
    reading_level TEXT NOT NULL,
    fluency_score FLOAT NOT NULL,
    comprehension_score FLOAT NOT NULL,
    suggestions TEXT[],
    areas_for_improvement TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create voice command history table
CREATE TABLE voice_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    interaction_id UUID REFERENCES voice_interactions(id),
    command_type TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    successful BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_voice_interactions_user ON voice_interactions(user_id);
CREATE INDEX idx_voice_interactions_type ON voice_interactions(type);
CREATE INDEX idx_reading_analysis_user ON reading_analysis(user_id);
CREATE INDEX idx_voice_commands_user ON voice_commands(user_id);

-- Enable RLS
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own voice interactions"
    ON voice_interactions FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own voice interactions"
    ON voice_interactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own reading analysis"
    ON reading_analysis FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own reading analysis"
    ON reading_analysis FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own voice commands"
    ON voice_commands FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own voice commands"
    ON voice_commands FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_voice_interaction_stats(user_id UUID)
RETURNS TABLE (
    interaction_type TEXT,
    total_count BIGINT,
    avg_confidence FLOAT,
    success_rate FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vi.type as interaction_type,
        COUNT(*) as total_count,
        AVG(CASE WHEN vc.confidence IS NOT NULL THEN vc.confidence ELSE 0 END) as avg_confidence,
        AVG(CASE WHEN vc.successful THEN 1 ELSE 0 END)::FLOAT as success_rate
    FROM voice_interactions vi
    LEFT JOIN voice_commands vc ON vi.id = vc.interaction_id
    WHERE vi.user_id = user_id
    GROUP BY vi.type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;