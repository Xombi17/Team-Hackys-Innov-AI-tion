-- WellSync AI Supabase Schema Migration

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    user_id TEXT UNIQUE NOT NULL,
    profile_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wellness Plans
CREATE TABLE IF NOT EXISTS wellness_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_data JSONB NOT NULL,
    confidence FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Shared States (Orchestration context)
CREATE TABLE IF NOT EXISTS shared_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agent Memory
CREATE TABLE IF NOT EXISTS agent_memory (
    id BIGSERIAL PRIMARY KEY,
    agent_name TEXT NOT NULL,
    memory_type TEXT NOT NULL,
    session_id TEXT,
    data JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. API Requests & Logs
CREATE TABLE IF NOT EXISTS api_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT UNIQUE NOT NULL,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    user_id TEXT,
    request_data JSONB,
    response_status INTEGER,
    response_data JSONB,
    duration_ms FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Feedback
CREATE TABLE IF NOT EXISTS user_feedback (
    id BIGSERIAL PRIMARY KEY,
    state_id TEXT NOT NULL,
    request_id TEXT,
    feedback_data JSONB NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. System Logs (Performance & Errors)
CREATE TABLE IF NOT EXISTS system_logs (
    id BIGSERIAL PRIMARY KEY,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    component TEXT,
    data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wellness_plans_user ON wellness_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_session ON agent_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_api_requests_user ON api_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_state ON user_feedback(state_id);

-- Enable RLS (Row Level Security) - Basic for hackathon (allow anon for now, can be restricted later)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_plans ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read/write for the hackathon
CREATE POLICY "Enable all ops for authenticated" ON user_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all ops for authenticated" ON wellness_plans FOR ALL TO authenticated USING (true);
