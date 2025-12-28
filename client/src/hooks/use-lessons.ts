import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Lesson, type Exercise } from "@shared/schema";

type LessonDetails = Lesson & {
  exercises: Exercise[];
};

// GET /api/lessons/:id
export function useLesson(id: number) {
  return useQuery({
    queryKey: [api.lessons.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.lessons.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch lesson");
      return api.lessons.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/lessons/:lessonId/progress
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, completed, score }: { lessonId: number; completed: boolean; score: number }) => {
      const url = buildUrl(api.progress.update.path, { lessonId });
      const res = await fetch(url, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed, score }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return api.progress.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { lessonId }) => {
      // Invalidate units list to show updated progress (green checkmarks)
      // Since we don't know the courseId here easily, we invalidate all units lists
      // In a larger app, we'd pass courseId or optimize this
      queryClient.invalidateQueries({ queryKey: [api.units.list.path] });
    },
  });
}
