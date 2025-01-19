-- Create AI assistants table
CREATE TABLE ai_assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assistant_id TEXT NOT NULL UNIQUE,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create conversations table
CREATE TABLE assistant_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    assistant_id UUID REFERENCES ai_assistants(id),
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active'
);

-- Create conversation messages table
CREATE TABLE assistant_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES assistant_conversations(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    file_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Create indexes
CREATE INDEX idx_assistants_project ON ai_assistants(project_id);
CREATE INDEX idx_conversations_user ON assistant_conversations(user_id);
CREATE INDEX idx_conversations_thread ON assistant_conversations(thread_id);
CREATE INDEX idx_messages_conversation ON assistant_messages(conversation_id);

-- Enable RLS
ALTER TABLE ai_assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view assistants"
    ON ai_assistants FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage assistants"
    ON ai_assistants
    USING (auth.get_role() = 'admin');

CREATE POLICY "Users can view their own conversations"
    ON assistant_conversations FOR SELECT
    USING (user_id = auth.uid() OR auth.get_role() = 'admin');

CREATE POLICY "Users can create their own conversations"
    ON assistant_conversations FOR INSERT
    WITH CHECK (user_id = auth.uid() OR auth.get_role() = 'admin');

CREATE POLICY "Users can view their own messages"
    ON assistant_messages FOR SELECT
    USING (
        conversation_id IN (
            SELECT id FROM assistant_conversations
            WHERE user_id = auth.uid()
        )
        OR auth.get_role() = 'admin'
    );

CREATE POLICY "Users can create their own messages"
    ON assistant_messages FOR INSERT
    WITH CHECK (
        conversation_id IN (
            SELECT id FROM assistant_conversations
            WHERE user_id = auth.uid()
        )
        OR auth.get_role() = 'admin'
    );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_ai_assistant_updated_at
    BEFORE UPDATE ON ai_assistants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_updated_at
    BEFORE UPDATE ON assistant_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();