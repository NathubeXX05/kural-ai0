import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Circle } from 'lucide-react';
import type { CourseWithUnits } from '@/lib/types/database';

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth');

    // Fetch course with units and lessons
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/courses/${id}`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        redirect('/learn');
    }

    const course: CourseWithUnits = await response.json();

    // Fetch user progress
    const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

    const progressMap = new Map(progress?.map(p => [p.lesson_id, p]) || []);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back button */}
                <Link href="/learn">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Courses
                    </Button>
                </Link>

                {/* Course Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                    <p className="text-muted-foreground text-lg">{course.description}</p>
                </div>

                {/* Units */}
                <div className="space-y-8">
                    {course.units?.map((unit, unitIndex) => (
                        <div key={unit.id} className="bg-card border rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                    {unitIndex + 1}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{unit.title}</h2>
                                    <p className="text-muted-foreground">{unit.description}</p>
                                </div>
                            </div>

                            {/* Lessons */}
                            <div className="space-y-3 mt-6">
                                {unit.lessons?.map((lesson, lessonIndex) => {
                                    const lessonProgress = progressMap.get(lesson.id);
                                    const isCompleted = lessonProgress?.completed || false;
                                    const isLocked = lessonIndex > 0 && !progressMap.get(unit.lessons[lessonIndex - 1]?.id)?.completed;

                                    return (
                                        <LessonCard
                                            key={lesson.id}
                                            lesson={lesson}
                                            isCompleted={isCompleted}
                                            isLocked={isLocked}
                                            score={lessonProgress?.score}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LessonCard({
    lesson,
    isCompleted,
    isLocked,
    score
}: {
    lesson: { id: number; title: string };
    isCompleted: boolean;
    isLocked: boolean;
    score?: number;
}) {
    return (
        <Link
            href={isLocked ? '#' : `/lesson/${lesson.id}`}
            className={`block ${isLocked ? 'pointer-events-none opacity-50' : ''}`}
        >
            <div className="bg-background border rounded-lg p-4 hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    {isLocked ? (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                    )}

                    <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {lesson.title}
                        </h3>
                        {isCompleted && score !== undefined && (
                            <p className="text-sm text-muted-foreground">Score: {score}%</p>
                        )}
                    </div>
                </div>

                {!isLocked && (
                    <Button
                        variant={isCompleted ? "outline" : "default"}
                        size="sm"
                        className={!isCompleted ? "bg-gradient-to-r from-orange-600 to-red-600" : ""}
                    >
                        {isCompleted ? 'Review' : 'Start'}
                    </Button>
                )}
            </div>
        </Link>
    );
}
