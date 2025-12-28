-- Seed data for Kural AI
-- Execute this AFTER running supabase-schema.sql

-- Insert Tamil Course
INSERT INTO courses (title, description) VALUES
('Tamil Basics', 'Learn the fundamentals of Tamil language with interactive lessons and AI-powered practice.')
ON CONFLICT DO NOTHING;

-- Get the course ID (assuming it's 1 if this is the first insert)
-- Insert Units
INSERT INTO units (course_id, title, description, "order") VALUES
(1, 'Introduction to Tamil', 'Start your Tamil journey with basic greetings and pronunciation', 1),
(1, 'Tamil Alphabet', 'Master the Tamil script and vowels', 2),
(1, 'Basic Conversations', 'Learn everyday phrases and simple conversations', 3)
ON CONFLICT DO NOTHING;

-- Insert Lessons for Unit 1
INSERT INTO lessons (unit_id, title, "order") VALUES
(1, 'Greetings', 1),
(1, 'Self Introduction', 2),
(1, 'Numbers 1-10', 3)
ON CONFLICT DO NOTHING;

-- Insert Lessons for Unit 2
INSERT INTO lessons (unit_id, title, "order") VALUES
(2, 'Vowels (உயிர் எழுத்துக்கள்)', 1),
(2, 'Consonants (மெய் எழுத்துக்கள்)', 2),
(2, 'Combined Letters', 3)
ON CONFLICT DO NOTHING;

-- Insert Lessons for Unit 3
INSERT INTO lessons (unit_id, title, "order") VALUES
(3, 'At the Market', 1),
(3, 'Asking for Directions', 2),
(3, 'Ordering Food', 3)
ON CONFLICT DO NOTHING;

-- Insert Exercises for Lesson 1 (Greetings)
INSERT INTO exercises (lesson_id, type, question, options, answer, "order") VALUES
(1, 'mcq', 'How do you say "Hello" in Tamil?', 
 '["வணக்கம் (Vanakkam)", "நன்றி (Nandri)", "போய் வா (Poi vaa)", "வா (Vaa)"]'::jsonb,
 'வணக்கம் (Vanakkam)', 1),
 
(1, 'mcq', 'What does "நன்றி" (Nandri) mean?',
 '["Hello", "Goodbye", "Thank you", "Please"]'::jsonb,
 'Thank you', 2),
 
(1, 'assist', 'Translate: Good morning',
 NULL,
 'காலை வணக்கம் (Kaalai Vanakkam)', 3)
ON CONFLICT DO NOTHING;

-- Insert Exercises for Lesson 2 (Self Introduction)
INSERT INTO exercises (lesson_id, type, question, options, answer, "order") VALUES
(2, 'mcq', 'How do you say "My name is..." in Tamil?',
 '["என் பெயர் (En peyar)", "நான் (Naan)", "உங்கள் பெயர் (Ungal peyar)", "அவர் பெயர் (Avar peyar)"]'::jsonb,
 'என் பெயர் (En peyar)', 1),
 
(2, 'assist', 'Complete: என் பெயர் _____ (My name is _____)',
 NULL,
 '[Your name]', 2),
 
(2, 'mcq', 'What does "நான் தமிழ் கற்கிறேன்" mean?',
 '["I am Tamil", "I speak Tamil", "I am learning Tamil", "I like Tamil"]'::jsonb,
 'I am learning Tamil', 3)
ON CONFLICT DO NOTHING;

-- Insert Exercises for Lesson 3 (Numbers 1-10)
INSERT INTO exercises (lesson_id, type, question, options, answer, "order") VALUES
(3, 'mcq', 'What is "ஒன்று" (Ondru) in English?',
 '["One", "Two", "Three", "Four"]'::jsonb,
 'One', 1),
 
(3, 'mcq', 'How do you say "Five" in Tamil?',
 '["மூன்று (Moondru)", "நான்கு (Naangu)", "ஐந்து (Ainthu)", "ஆறு (Aaru)"]'::jsonb,
 'ஐந்து (Ainthu)', 2),
 
(3, 'assist', 'Write the Tamil number for 10',
 NULL,
 'பத்து (Paththu)', 3)
ON CONFLICT DO NOTHING;

-- Insert Exercises for Lesson 4 (Vowels)
INSERT INTO exercises (lesson_id, type, question, options, answer, "order") VALUES
(4, 'mcq', 'Which is the first Tamil vowel?',
 '["அ (A)", "ஆ (Aa)", "இ (I)", "ஈ (Ee)"]'::jsonb,
 'அ (A)', 1),
 
(4, 'mcq', 'How many vowels are there in Tamil?',
 '["10", "12", "14", "16"]'::jsonb,
 '12', 2),
 
(4, 'assist', 'Write the Tamil vowel for the sound "Ee" (as in "see")',
 NULL,
 'ஈ', 3)
ON CONFLICT DO NOTHING;

-- Verify the data
SELECT 'Courses:', COUNT(*) FROM courses;
SELECT 'Units:', COUNT(*) FROM units;
SELECT 'Lessons:', COUNT(*) FROM lessons;
SELECT 'Exercises:', COUNT(*) FROM exercises;
