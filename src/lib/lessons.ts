// Lesson metadata for better UX
export const lessonTitles: Record<string, { title: string; description: string; unit: number }> = {
    "1": {
        title: "Basic Greetings",
        description: "Learn essential Tamil greetings and polite expressions",
        unit: 1,
    },
    "2": {
        title: "Family Members",
        description: "Identify and name family relationships in Tamil",
        unit: 1,
    },
    "3": {
        title: "Food & Drink",
        description: "Common words for food, water, and meals",
        unit: 1,
    },
    "4": {
        title: "Daily Conversations",
        description: "Ask and answer common questions about well-being",
        unit: 1,
    },
    "5": {
        title: "Numbers 1-10",
        description: "Count from one to ten in Tamil",
        unit: 1,
    },
    "6": {
        title: "Colors",
        description: "Describe objects using basic color vocabulary",
        unit: 1,
    },
    "7": {
        title: "Introductions",
        description: "Introduce yourself and ask others' names",
        unit: 2,
    },
    "8": {
        title: "Time & Days",
        description: "Talk about time, days, and scheduling",
        unit: 2,
    },
    "9": {
        title: "Preferences & Politeness",
        description: "Express likes, dislikes, and polite requests",
        unit: 2,
    },
};

export function getLessonTitle(id: string): string {
    return lessonTitles[id]?.title || `Lesson ${id}`;
}

export function getLessonDescription(id: string): string {
    return lessonTitles[id]?.description || "";
}
