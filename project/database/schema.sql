-- Roles enum
CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin');

-- Update users table with role
ALTER TABLE users 
ADD COLUMN role user_role NOT NULL DEFAULT 'student',
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Parent-Student Relationships
CREATE TABLE parent_student_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id),
    CONSTRAINT different_users CHECK (parent_id != student_id)
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mindfulness_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;

-- Create authenticated user function
CREATE OR REPLACE FUNCTION auth.get_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Create function to check if user is parent of student
CREATE OR REPLACE FUNCTION auth.is_parent_of(student_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_student_relationships
    WHERE parent_id = auth.uid()
    AND student_id = $1
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (
        id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent' 
            AND auth.is_parent_of(id)
        )
    );

CREATE POLICY "Only admins can create users"
    ON users FOR INSERT
    WITH CHECK (auth.get_role() = 'admin');

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid() OR auth.get_role() = 'admin');

CREATE POLICY "Only admins can delete users"
    ON users FOR DELETE
    USING (auth.get_role() = 'admin');

-- Tasks table policies
CREATE POLICY "Users can view own tasks"
    ON tasks FOR SELECT
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent' 
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can create own tasks"
    ON tasks FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent' 
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent' 
            AND auth.is_parent_of(user_id)
        )
    );

CREATE POLICY "Users can delete own tasks"
    ON tasks FOR DELETE
    USING (
        user_id = auth.uid()
        OR auth.get_role() = 'admin'
        OR (
            auth.get_role() = 'parent' 
            AND auth.is_parent_of(user_id)
        )
    );

-- Similar policies for other tables...
-- (Homework, Grades, Journal, etc. following same pattern)

-- Parent-Student relationships policies
CREATE POLICY "Only admins can manage relationships"
    ON parent_student_relationships
    USING (auth.get_role() = 'admin');

-- Create admin functions
CREATE OR REPLACE FUNCTION admin_create_user(
    email TEXT,
    password TEXT,
    name TEXT,
    role user_role
) RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    IF auth.get_role() != 'admin' THEN
        RAISE EXCEPTION 'Only admins can create users';
    END IF;

    INSERT INTO auth.users (email, encrypted_password)
    VALUES (email, crypt(password, gen_salt('bf')))
    RETURNING id INTO new_user_id;

    INSERT INTO users (id, email, name, role)
    VALUES (new_user_id, email, name, role);

    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_link_parent_student(
    parent_id UUID,
    student_id UUID,
    is_primary BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
    relationship_id UUID;
BEGIN
    IF auth.get_role() != 'admin' THEN
        RAISE EXCEPTION 'Only admins can link parents and students';
    END IF;

    INSERT INTO parent_student_relationships (parent_id, student_id, is_primary)
    VALUES (parent_id, student_id, is_primary)
    RETURNING id INTO relationship_id;

    RETURN relationship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_parent_student_relationships_parent ON parent_student_relationships(parent_id);
CREATE INDEX idx_parent_student_relationships_student ON parent_student_relationships(student_id);
CREATE INDEX idx_users_role ON users(role);

-- Add trigger for relationship updated_at
CREATE TRIGGER update_parent_student_relationships_updated_at
    BEFORE UPDATE ON parent_student_relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();