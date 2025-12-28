import { supabase } from './supabase';

// Progress tracking system with Supabase
export interface UserProgress {
    completedLessons: string[];
    currentStreak: number;
    totalXP: number;
    lastActivityDate: string;
    gems: number;
    achievements: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
    completedLessons: [],
    currentStreak: 0,
    totalXP: 0,
    lastActivityDate: "",
    gems: 500,
    achievements: [],
};

export async function getProgress(): Promise<UserProgress> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Fallback to localStorage for non-authenticated users
            if (typeof window === "undefined") return DEFAULT_PROGRESS;
            const stored = localStorage.getItem("kural_progress");
            if (!stored) return DEFAULT_PROGRESS;
            return JSON.parse(stored);
        }

        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !data) {
            return DEFAULT_PROGRESS;
        }

        return {
            completedLessons: data.completed_lessons || [],
            currentStreak: data.current_streak || 0,
            totalXP: data.total_xp || 0,
            lastActivityDate: data.last_activity_date || "",
            gems: data.gems || 500,
            achievements: data.achievements || [],
        };
    } catch (error) {
        console.error('Error fetching progress:', error);
        return DEFAULT_PROGRESS;
    }
}

export async function saveProgress(progress: UserProgress) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Fallback to localStorage
            if (typeof window === "undefined") return;
            localStorage.setItem("kural_progress", JSON.stringify(progress));
            return;
        }

        const { error } = await supabase
            .from('user_progress')
            .update({
                completed_lessons: progress.completedLessons,
                current_streak: progress.currentStreak,
                total_xp: progress.totalXP,
                last_activity_date: progress.lastActivityDate,
                gems: progress.gems,
                achievements: progress.achievements,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id);

        if (error) {
            console.error('Error saving progress:', error);
        }
    } catch (error) {
        console.error('Error in saveProgress:', error);
    }
}

export async function completeLesson(lessonId: string): Promise<UserProgress> {
    const progress = await getProgress();

    if (progress.completedLessons.includes(lessonId)) {
        return progress;
    }

    const xpEarned = 20;
    const gemsEarned = 5;

    const updatedProgress: UserProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, lessonId],
        totalXP: progress.totalXP + xpEarned,
        gems: progress.gems + gemsEarned,
        lastActivityDate: new Date().toISOString(),
    };

    // Update streak
    const today = new Date().toDateString();
    const lastActivity = progress.lastActivityDate
        ? new Date(progress.lastActivityDate).toDateString()
        : "";

    if (lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastActivity === yesterdayStr) {
            updatedProgress.currentStreak = progress.currentStreak + 1;
        } else if (lastActivity === "") {
            updatedProgress.currentStreak = 1;
        } else {
            updatedProgress.currentStreak = 1;
        }
    }

    await saveProgress(updatedProgress);
    return updatedProgress;
}

export function getNextLesson(completedLessons: string[]): string {
    const allLessons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (const lesson of allLessons) {
        if (!completedLessons.includes(lesson)) {
            return lesson;
        }
    }

    return "1";
}

export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
    const lessonNum = parseInt(lessonId);

    if (lessonNum === 1) return true;

    const previousLesson = (lessonNum - 1).toString();
    return completedLessons.includes(previousLesson);
}
