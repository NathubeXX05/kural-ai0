'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Circle } from 'lucide-react';
import type { CourseWithUnits } from '@/lib/types/database';

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>(null);
    const [progressMap, setProgressMap] = useState<Map<number, any>>(new Map());

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/auth');
            return;
        }
        setUser(user);

        // Fetch course with units and lessons manually
        // Since we can't easily join deep relations with just supabase client without advanced query
        // We will do cascading fetches which is simpler for now

        // 1. Get Course
        const { data: courseData } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

        if (!courseData) {
            router.push('/learn');
            return;
        }

        // 2. Get Units
        const { data: unitsData } = await supabase
            .from('units')
            .select('*')
            .eq('course_id', id)
            .order('order', { ascending: true });

        // 3. For each unit, get lessons
        const unitsWithLessons = await Promise.all((unitsData || []).map(async (unit) => {
            const { data: lessonsData } = await supabase
                .from('lessons')
                .select('*')
                .eq('unit_id', unit.id)
                .order('order', { ascending: true });

            return {
                ...unit,
                lessons: lessonsData || []
            };
        }));

        const fullCourse = {
            ...courseData,
            units: unitsWithLessons
        };

        setCourse(fullCourse);

        // 4. Fetch user progress
        const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

        const pMap = new Map(progress?.map((p: any) => [p.lesson_id, p]) || []);
        setProgressMap(pMap);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!course) return null;

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
                    {course.units?.map((unit: any, unitIndex: number) => (
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
                                {unit.lessons?.map((lesson: any, lessonIndex: number) => {
                                    const lessonProgress = progressMap.get(lesson.id);
                                    const isCompleted = lessonProgress?.completed || false;

                                    // Lock logic: Previous lesson must be completed
                                    // Simplified: If it's the first lesson of first unit, it's unlocked
                                    // Otherwise, check previous lesson completion
                                    let isLocked = false;
                                    if (unitIndex === 0 && lessonIndex === 0) {
                                        isLocked = false;
                                    } else if (lessonIndex > 0) {
                                        const prevLesson = unit.lessons[lessonIndex - 1];
                                        isLocked = !progressMap.get(prevLesson.id)?.completed;
                                    } else if (unitIndex > 0) {
                                        // Check last lesson of previous unit
                                        const prevUnit = course.units[unitIndex - 1];
                                        if (prevUnit && prevUnit.lessons.length > 0) {
                                            const lastLessonOfPrevUnit = prevUnit.lessons[prevUnit.lessons.length - 1];
                                            isLocked = !progressMap.get(lastLessonOfPrevUnit.id)?.completed;
                                        }
                                    }

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
