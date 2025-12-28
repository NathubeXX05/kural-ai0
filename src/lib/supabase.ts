import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing!');
    console.error('URL:', supabaseUrl ? '✓' : '✗');
    console.error('Key:', supabaseAnonKey ? '✓' : '✗');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export interface UserProgress {
    id: string;
    user_id: string;
    completed_lessons: string[];
    current_streak: number;
    total_xp: number;
    gems: number;
    last_activity_date: string;
    achievements: string[];
    created_at: string;
    updated_at: string;
}

export interface Lesson {
    id: string;
    title: string;
    description: string;
    unit: number;
    order: number;
    questions: any;
    created_at: string;
}
