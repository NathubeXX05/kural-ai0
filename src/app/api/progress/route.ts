import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET user progress
export async function GET() {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch user progress
        const { data: progress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching progress:', error);
            return NextResponse.json(
                { error: 'Failed to fetch progress' },
                { status: 500 }
            );
        }

        return NextResponse.json(progress || []);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST/UPDATE user progress
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { lesson_id, completed, score } = body;

        if (!lesson_id) {
            return NextResponse.json(
                { error: 'lesson_id is required' },
                { status: 400 }
            );
        }

        // Upsert progress (insert or update if exists)
        const { data: progress, error } = await supabase
            .from('user_progress')
            .upsert(
                {
                    user_id: user.id,
                    lesson_id,
                    completed: completed ?? false,
                    score: score ?? 0,
                },
                {
                    onConflict: 'user_id,lesson_id',
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Error updating progress:', error);
            return NextResponse.json(
                { error: 'Failed to update progress' },
                { status: 500 }
            );
        }

        return NextResponse.json(progress);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
