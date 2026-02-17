import { z } from 'zod';
import { insertVisitorSchema, visitors } from './schema';

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
  visitors: {
    list: {
      method: 'GET' as const,
      path: '/api/visitors' as const,
      input: z.object({
        search: z.string().optional(),
        limit: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof visitors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/visitors/:id' as const,
      responses: {
        200: z.custom<typeof visitors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/visitors' as const,
      input: insertVisitorSchema,
      responses: {
        201: z.custom<typeof visitors.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/visitors/:id' as const,
      input: insertVisitorSchema.partial(),
      responses: {
        200: z.custom<typeof visitors.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    exit: {
      method: 'PATCH' as const,
      path: '/api/visitors/:id/exit' as const,
      responses: {
        200: z.custom<typeof visitors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/visitors/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalEntries: z.number(),
          totalExits: z.number(),
          currentInside: z.number(),
        }),
      },
    },
  }
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

export type VisitorInput = z.infer<typeof api.visitors.create.input>;
export type VisitorResponse = z.infer<typeof api.visitors.create.responses[201]>;
