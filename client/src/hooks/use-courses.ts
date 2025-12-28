import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type Unit, type Lesson } from "@shared/schema";

// Types derived from schema/routes
type Course = {
  id: number;
  title: string;
  description: string;
};

type UnitWithLessons = Unit & {
  lessons: (Lesson & { completed: boolean })[];
};

// GET /api/courses
export function useCourses() {
  return useQuery({
    queryKey: [api.courses.list.path],
    queryFn: async () => {
      const res = await fetch(api.courses.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch courses");
      return api.courses.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/courses/:courseId/units
export function useUnits(courseId: number) {
  return useQuery({
    queryKey: [api.units.list.path, courseId],
    queryFn: async () => {
      const url = buildUrl(api.units.list.path, { courseId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch units");
      return api.units.list.responses[200].parse(await res.json());
    },
    enabled: !!courseId,
  });
}
