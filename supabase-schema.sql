-- Kural AI - Supabase Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units table
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'mcq', 'assist'
  question TEXT NOT NULL,
  options JSONB, -- For MCQ options
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress table
-- Note: user_id references auth.users(id) which is UUID in Supabase
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  score INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id) -- One progress entry per user per lesson
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_units_course_id ON units(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);

-- Enable Row Level Security (RLS)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Courses: Everyone can read
CREATE POLICY "Courses are viewable by everyone" 
  ON courses FOR SELECT 
  USING (true);

-- Units: Everyone can read
CREATE POLICY "Units are viewable by everyone" 
  ON units FOR SELECT 
  USING (true);

-- Lessons: Everyone can read
CREATE POLICY "Lessons are viewable by everyone" 
  ON lessons FOR SELECT 
  USING (true);

-- Exercises: Everyone can read
CREATE POLICY "Exercises are viewable by everyone" 
  ON exercises FOR SELECT 
  USING (true);

-- User Progress: Users can only see and modify their own progress
CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE courses IS 'Tamil learning courses';
COMMENT ON TABLE units IS 'Units within courses';
COMMENT ON TABLE lessons IS 'Lessons within units';
COMMENT ON TABLE exercises IS 'Exercises within lessons';
COMMENT ON TABLE user_progress IS 'User progress tracking for lessons';
