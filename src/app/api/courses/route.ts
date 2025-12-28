import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching courses:', error);
            return NextResponse.json(
                { error: 'Failed to fetch courses' },
                { status: 500 }
            );
        }

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
