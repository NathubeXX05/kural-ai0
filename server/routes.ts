import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // App Routes

  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.units.list.path, async (req, res) => {
    // If not authenticated, we can still show units but without progress
    // But for this app, let's assume public access for structure is fine
    const courseId = Number(req.params.courseId);
    const units = await storage.getUnits(courseId);

    // Fetch lessons for each unit and attach user progress if logged in
    const unitsWithLessons = await Promise.all(units.map(async (unit) => {
      const lessons = await storage.getLessons(unit.id);

      const lessonsWithProgress = await Promise.all(lessons.map(async (lesson) => {
        let completed = false;
        if (req.isAuthenticated()) {
          const user = req.user as any;
          // user.id is the ID in local auth
          const progress = await storage.getUserProgress(user.id, lesson.id);
          if (progress?.completed) completed = true;
        }
        return { ...lesson, completed };
      }));

      return { ...unit, lessons: lessonsWithProgress };
    }));

    res.json(unitsWithLessons);
  });

  app.get(api.lessons.get.path, async (req, res) => {
    const lesson = await storage.getLesson(Number(req.params.id));
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  });

  app.post(api.progress.update.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as any;
    const lessonId = Number(req.params.lessonId);
    const { completed, score } = req.body;

    const progress = await storage.updateUserProgress(user.id, lessonId, completed, score);
    res.json(progress);
  });

  // Seed Data
  if ((await storage.getCourses()).length === 0) {
    console.log("Seeding database...");
    const course = await storage.createCourse({
      title: "Tamil",
      description: "Learn the ancient language of Tamil"
    });

    const unit1 = await storage.createUnit({
      courseId: course.id,
      title: "Basics 1",
      description: "Learn the basic letters and greetings",
      order: 1
    });

    const lesson1 = await storage.createLesson({ unitId: unit1.id, title: "Vowels (Uyir Ezhuthukkal)", order: 1 });
    await storage.createExercise({ lessonId: lesson1.id, type: "mcq", question: "Which letter represents 'A' (sound as in America)?", options: ["அ", "ஆ", "இ", "ஈ"], answer: "அ", order: 1 });
    await storage.createExercise({ lessonId: lesson1.id, type: "mcq", question: "Which letter represents 'Aa' (sound as in Art)?", options: ["அ", "ஆ", "இ", "ஈ"], answer: "ஆ", order: 2 });

    const lesson2 = await storage.createLesson({ unitId: unit1.id, title: "Greetings", order: 2 });
    await storage.createExercise({ lessonId: lesson2.id, type: "assist", question: "Translate 'Hello' to Tamil", answer: "Vanakkam", order: 1, options: ["Vanakkam", "Nandri", "Poitu varen"] });
    await storage.createExercise({ lessonId: lesson2.id, type: "assist", question: "Translate 'Nandri' to English", answer: "Thank you", order: 2, options: ["Hello", "Thank you", "Goodbye"] });

    const unit2 = await storage.createUnit({
      courseId: course.id,
      title: "Basics 2",
      description: "Simple words and family",
      order: 2
    });
    const lesson3 = await storage.createLesson({ unitId: unit2.id, title: "Family", order: 1 });
    await storage.createExercise({ lessonId: lesson3.id, type: "assist", question: "Translate 'Amma'", answer: "Mother", order: 1, options: ["Mother", "Father", "Sister"] });

    console.log("Database seeded!");
  }

  return httpServer;
}
