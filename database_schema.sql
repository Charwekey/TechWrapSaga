-- 1. Users Table (Authentication)
-- Matches AuthModal.jsx inputs: Name, Email, Password, Title
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Wraps Table (Data Collection)
-- Matches FormPage.jsx inputs: Projects, Tools, Events, Challenges, Goals, Theme
CREATE TABLE IF NOT EXISTS "Wraps" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
    "year" INTEGER DEFAULT 2025,
    "theme" VARCHAR(255) DEFAULT 'neutral',
    
    -- Array fields (from comma-separated textareas)
    "projects" TEXT[] DEFAULT ARRAY[]::TEXT[],           -- "Projects Built"
    "tools_learned" TEXT[] DEFAULT ARRAY[]::TEXT[],      -- "Tech Stack Learned"
    "events_attended" TEXT[] DEFAULT ARRAY[]::TEXT[],    -- "Events Attended"
    "events_spoken_at" TEXT[] DEFAULT ARRAY[]::TEXT[],   -- "Events Spoken At"
    "challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],         -- "Biggest Challenge"
    "overcome_challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],-- "How You Overcame It"
    "goals_2026" TEXT[] DEFAULT ARRAY[]::TEXT[],         -- "Goals for 2026"

    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
