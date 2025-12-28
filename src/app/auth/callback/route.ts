import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/learn';

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options });
                        } catch (error) {
                            // Handle cookie setting errors
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) {
                            // Handle cookie removal errors
                        }
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if user profile exists, if not create it
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            if (!profile) {
                // Create user profile
                await supabase.from('user_profiles').insert([
                    {
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
                        avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
                    },
                ]);

                // Create user progress
                await supabase.from('user_progress').insert([
                    {
                        user_id: data.user.id,
                        completed_lessons: [],
                        current_streak: 0,
                        total_xp: 0,
                        gems: 500,
                        last_activity_date: new Date().toISOString(),
                        achievements: [],
                    },
                ]);

                // Redirect to onboarding for new users
                return NextResponse.redirect(new URL('/onboarding', request.url));
            }
        }
    }

    // Redirect to the next URL or /learn
    return NextResponse.redirect(new URL(next, request.url));
}
