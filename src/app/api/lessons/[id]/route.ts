import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Fetch lesson with exercises
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', id)
            .single();

        if (lessonError || !lesson) {
            return NextResponse.json(
                { error: 'Lesson not found' },
                { status: 404 }
            );
        }

        // Fetch exercises for this lesson
        const { data: exercises, error: exercisesError } = await supabase
            .from('exercises')
            .select('*')
            .eq('lesson_id', id)
            .order('order', { ascending: true });

        if (exercisesError) {
            console.error('Error fetching exercises:', exercisesError);
            return NextResponse.json(
                { error: 'Failed to fetch exercises' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            ...lesson,
            exercises: exercises || [],
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
