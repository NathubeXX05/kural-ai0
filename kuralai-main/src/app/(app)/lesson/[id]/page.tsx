'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import type { LessonWithExercises, Exercise } from '@/lib/types/database';

export default function LessonPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [lesson, setLesson] = useState<LessonWithExercises | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLesson();
    }, [params.id]);

    const fetchLesson = async () => {
        try {
            const res = await fetch(`/api/lessons/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setLesson(data);
            }
        } catch (error) {
            console.error('Error fetching lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentExercise = lesson?.exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === (lesson?.exercises.length || 0) - 1;

    const handleSubmit = () => {
        if (!currentExercise) return;

        const correct = userAnswer.trim().toLowerCase() === currentExercise.answer.trim().toLowerCase();
        setIsCorrect(correct);
        setShowFeedback(true);

        if (correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (isLastExercise) {
            // Save progress
            saveProgress();
        } else {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setUserAnswer('');
            setShowFeedback(false);
        }
    };

    const saveProgress = async () => {
        const finalScore = Math.round((score / (lesson?.exercises.length || 1)) * 100);

        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lesson_id: parseInt(params.id),
                    completed: true,
                    score: finalScore,
                }),
            });

            // Redirect back to course
            router.push('/learn');
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!lesson || !currentExercise) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Lesson not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Question {currentExerciseIndex + 1} of {lesson.exercises.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-8">
                    <div
                        className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentExerciseIndex + 1) / lesson.exercises.length) * 100}%` }}
                    />
                </div>

                {/* Exercise */}
                <div className="bg-card border rounded-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-6">{currentExercise.question}</h2>

                    {currentExercise.type === 'mcq' && currentExercise.options ? (
                        <div className="space-y-3">
                            {currentExercise.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => setUserAnswer(option)}
                                    disabled={showFeedback}
                                    className={`w-full p-4 text-left border rounded-lg transition-all ${userAnswer === option
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        } ${showFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={showFeedback}
                            placeholder="Type your answer..."
                            className="w-full p-4 border rounded-lg bg-background"
                        />
                    )}
                </div>

                {/* Feedback */}
                {showFeedback && (
                    <div className={`p-6 rounded-lg mb-6 ${isCorrect ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            {isCorrect ? (
                                <>
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <h3 className="text-lg font-bold text-green-500">Correct!</h3>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-6 h-6 text-red-500" />
                                    <h3 className="text-lg font-bold text-red-500">Not quite</h3>
                                </>
                            )}
                        </div>
                        {!isCorrect && (
                            <p className="text-sm">The correct answer is: <strong>{currentExercise.answer}</strong></p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                    {!showFeedback ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!userAnswer}
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                            {isLastExercise ? 'Finish Lesson' : 'Next Question'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
