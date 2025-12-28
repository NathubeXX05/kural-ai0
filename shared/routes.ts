import { z } from 'zod';
import { 
  insertUserProgressSchema, 
  courses, 
  units, 
  lessons, 
  exercises, 
  userProgress 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
  },
  units: {
    list: {
      method: 'GET' as const,
      path: '/api/courses/:courseId/units',
      responses: {
        200: z.array(z.custom<typeof units.$inferSelect & { lessons: (typeof lessons.$inferSelect & { completed: boolean })[] }>()),
      },
    },
  },
  lessons: {
    get: {
      method: 'GET' as const,
      path: '/api/lessons/:id',
      responses: {
        200: z.custom<typeof lessons.$inferSelect & { exercises: typeof exercises.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    update: {
      method: 'POST' as const,
      path: '/api/lessons/:lessonId/progress',
      input: z.object({
        completed: z.boolean(),
        score: z.number(),
      }),
      responses: {
        200: z.custom<typeof userProgress.$inferSelect>(),
        401: errorSchemas.internal, // Unauthorized
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
