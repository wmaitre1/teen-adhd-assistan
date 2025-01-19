-- Create learning style tracking tables
CREATE TABLE learning_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    method TEXT NOT NULL,
    success_rate FLOAT NOT NULL,
    engagement_time INTEGER NOT NULL,
    completion_rate FLOAT NOT NULL,
    focus_score FLOAT NOT NULL,
    subject TEXT,
    topic TEXT,
    strategy TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE learning_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    preferred_methods TEXT[] NOT NULL DEFAULT '{}',
    optimal_duration INTEGER,
    best_time_of_day TEXT,
    challenging_areas TEXT[] NOT NULL DEFAULT '{}',
    successful_strategies TEXT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_learning_interactions_user_time ON learning_interactions(user_id, timestamp);
CREATE INDEX idx_learning_interactions_method ON learning_interactions(method);
CREATE INDEX idx_learning_preferences_user ON learning_preferences(user_id);

-- Enable RLS
ALTER TABLE learning_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own learning interactions"
    ON learning_interactions FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create their own learning interactions"
    ON learning_interactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own learning preferences"
    ON learning_preferences FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent'
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can update their own learning preferences"
    ON learning_preferences FOR UPDATE
    USING (user_id = auth.uid());

-- Create function to update learning preferences
CREATE OR REPLACE FUNCTION update_learning_preferences()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate new preferences based on recent interactions
    WITH recent_interactions AS (
        SELECT *
        FROM learning_interactions
        WHERE user_id = NEW.user_id
        AND timestamp >= NOW() - INTERVAL '30 days'
    ),
    method_stats AS (
        SELECT 
            method,
            AVG(success_rate) as avg_success,
            AVG(focus_score) as avg_focus,
            COUNT(*) as interaction_count
        FROM recent_interactions
        GROUP BY method
        ORDER BY (AVG(success_rate) + AVG(focus_score))/2 DESC
        LIMIT 2
    ),
    time_stats AS (
        SELECT 
            CASE 
                WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 6 AND 9 THEN 'Early Morning'
                WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 10 AND 13 THEN 'Late Morning'
                WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 14 AND 17 THEN 'Afternoon'
                WHEN EXTRACT(HOUR FROM timestamp) BETWEEN 18 AND 21 THEN 'Evening'
                ELSE 'Night'
            END as time_of_day,
            AVG(success_rate) as avg_success,
            AVG(focus_score) as avg_focus,
            COUNT(*) as session_count
        FROM recent_interactions
        GROUP BY time_of_day
        ORDER BY (AVG(success_rate) + AVG(focus_score))/2 DESC
        LIMIT 1
    )
    UPDATE learning_preferences
    SET 
        preferred_methods = ARRAY(SELECT method FROM method_stats),
        optimal_duration = (
            SELECT AVG(engagement_time)::INTEGER
            FROM recent_interactions
            WHERE success_rate >= 0.7
        ),
        best_time_of_day = (
            SELECT time_of_day
            FROM time_stats
            LIMIT 1
        ),
        challenging_areas = ARRAY(
            SELECT subject
            FROM recent_interactions
            WHERE success_rate < 0.5
            GROUP BY subject
            ORDER BY COUNT(*) DESC
            LIMIT 3
        ),
        successful_strategies = ARRAY(
            SELECT strategy
            FROM recent_interactions
            WHERE success_rate >= 0.8
            GROUP BY strategy
            ORDER BY COUNT(*) DESC
            LIMIT 5
        ),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update preferences
CREATE TRIGGER update_learning_preferences_trigger
    AFTER INSERT ON learning_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_learning_preferences();