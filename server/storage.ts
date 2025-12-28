import { db } from "./db";
import { 
  courses, units, lessons, exercises, userProgress,
  type Course, type Unit, type Lesson, type Exercise, type UserProgress, type UnitWithLessons
} from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";

export interface IStorage {
  getCourses(): Promise<Course[]>;
  getUnits(courseId: number): Promise<Unit[]>;
  getLessons(unitId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<(Lesson & { exercises: Exercise[] }) | undefined>;
  getUserProgress(userId: string, lessonId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, lessonId: number, completed: boolean, score: number): Promise<UserProgress>;
  
  // Seed helpers
  createCourse(course: any): Promise<Course>;
  createUnit(unit: any): Promise<Unit>;
  createLesson(lesson: any): Promise<Lesson>;
  createExercise(exercise: any): Promise<Exercise>;
}

export class DatabaseStorage implements IStorage {
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getUnits(courseId: number): Promise<Unit[]> {
    return await db.select().from(units).where(eq(units.courseId, courseId)).orderBy(asc(units.order));
  }

  async getLessons(unitId: number): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.unitId, unitId)).orderBy(asc(lessons.order));
  }

  async getLesson(id: number): Promise<(Lesson & { exercises: Exercise[] }) | undefined> {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: {
        exercises: true,
      },
    });
    return lesson;
  }

  async getUserProgress(userId: string, lessonId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
    return progress;
  }

  async updateUserProgress(userId: string, lessonId: number, completed: boolean, score: number): Promise<UserProgress> {
    const [progress] = await db.insert(userProgress)
      .values({ userId, lessonId, completed, score })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: { completed, score },
      })
      .returning();
    return progress;
  }

  async createCourse(data: any): Promise<Course> {
    const [res] = await db.insert(courses).values(data).returning();
    return res;
  }
  async createUnit(data: any): Promise<Unit> {
    const [res] = await db.insert(units).values(data).returning();
    return res;
  }
  async createLesson(data: any): Promise<Lesson> {
    const [res] = await db.insert(lessons).values(data).returning();
    return res;
  }
  async createExercise(data: any): Promise<Exercise> {
    const [res] = await db.insert(exercises).values(data).returning();
    return res;
  }
}

export const storage = new DatabaseStorage();
