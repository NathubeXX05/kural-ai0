import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, Target } from 'lucide-react';

export default async function LearnPage() {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // If no user, show a client component that redirects
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Redirecting to login...</p>
                <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/auth?redirectTo=/learn'` }} />
            </div>
        );
    }


    // Fetch courses
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .order('id', { ascending: true });

    // Fetch user progress
    const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

    const completedLessons = progress?.filter(p => p.completed).length || 0;
    const totalScore = progress?.reduce((sum, p) => sum + p.score, 0) || 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Learn Tamil</h1>
                    <p className="text-muted-foreground">Choose a course to start your journey</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={<BookOpen className="w-5 h-5" />}
                        label="Lessons Completed"
                        value={completedLessons}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={<Trophy className="w-5 h-5" />}
                        label="Total Score"
                        value={totalScore}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        icon={<Target className="w-5 h-5" />}
                        label="Current Streak"
                        value="0 days"
                        color="bg-green-500"
                    />
                </div>

                {/* Courses */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Courses</h2>

                    {courses && courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                            <p className="text-muted-foreground">No courses available yet.</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Check back soon for new content!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    return (
        <div className="bg-card border rounded-lg p-6 flex items-center gap-4">
            <div className={`${color} p-3 rounded-lg text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
}

function CourseCard({ course }: { course: { id: number; title: string; description: string } }) {
    return (
        <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2">{course.title}</h3>
            <p className="text-muted-foreground mb-6 line-clamp-2">{course.description}</p>

            <Link href={`/learn/${course.id}`}>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    Start Learning
                </Button>
            </Link>
        </div>
    );
}
