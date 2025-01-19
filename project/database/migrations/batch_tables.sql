-- Create batch_jobs table
CREATE TABLE batch_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    request_count INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error TEXT,
    metadata JSONB
);

-- Create index for faster lookups
CREATE INDEX idx_batch_jobs_batch_id ON batch_jobs(batch_id);
CREATE INDEX idx_batch_jobs_user_id ON batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON batch_jobs(status);

-- Enable RLS
ALTER TABLE batch_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own batch jobs"
    ON batch_jobs FOR SELECT
    USING (user_id = auth.uid() OR auth.get_role() = 'admin');

CREATE POLICY "Users can create their own batch jobs"
    ON batch_jobs FOR INSERT
    WITH CHECK (user_id = auth.uid() OR auth.get_role() = 'admin');

-- Create function to clean up old batch jobs
CREATE OR REPLACE FUNCTION cleanup_old_batch_jobs()
RETURNS void AS $$
BEGIN
    DELETE FROM batch_jobs
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;