import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        // Fetch course with its units and lessons
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (courseError || !course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        // Fetch units for this course
        const { data: units, error: unitsError } = await supabase
            .from('units')
            .select('*')
            .eq('course_id', id)
            .order('order', { ascending: true });

        if (unitsError) {
            console.error('Error fetching units:', unitsError);
            return NextResponse.json(
                { error: 'Failed to fetch units' },
                { status: 500 }
            );
        }

        // Fetch lessons for each unit
        const unitsWithLessons = await Promise.all(
            (units || []).map(async (unit) => {
                const { data: lessons } = await supabase
                    .from('lessons')
                    .select('*')
                    .eq('unit_id', unit.id)
                    .order('order', { ascending: true });

                return {
                    ...unit,
                    lessons: lessons || [],
                };
            })
        );

        return NextResponse.json({
            ...course,
            units: unitsWithLessons,
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
