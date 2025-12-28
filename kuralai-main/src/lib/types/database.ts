// Database types for Kural AI

export interface Course {
    id: number;
    title: string;
    description: string;
    created_at?: string;
}

export interface Unit {
    id: number;
    course_id: number;
    title: string;
    description: string;
    order: number;
    created_at?: string;
}

export interface Lesson {
    id: number;
    unit_id: number;
    title: string;
    order: number;
    created_at?: string;
}

export interface Exercise {
    id: number;
    lesson_id: number;
    type: 'mcq' | 'assist';
    question: string;
    options?: string[]; // For MCQ
    answer: string;
    order: number;
    created_at?: string;
}

export interface UserProgress {
    id: number;
    user_id: string; // UUID
    lesson_id: number;
    completed: boolean;
    score: number;
    created_at?: string;
    updated_at?: string;
}

// Extended types with relations
export interface LessonWithExercises extends Lesson {
    exercises: Exercise[];
}

export interface UnitWithLessons extends Unit {
    lessons: Lesson[];
}

export interface CourseWithUnits extends Course {
    units: UnitWithLessons[];
}
