import { z } from 'zod';

export const inputCreateTopicMap = z.object({
  reportId: z.string(),
});

export const outputCreateTopicMap = z.object({
  success: z.boolean(),
  id: z.string().optional(),
});
