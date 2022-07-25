import { z } from 'zod';

export const inputUpdateDiscoveryGroup = z.object({
  reportId: z.string(),
  keywords: z.array(z.string()),
  group: z.string(),
  action: z.enum(['add', 'remove']),
});

export const outputUpdateDiscoveryGroup = z.object({
  success: z.boolean(),
  count: z.number().optional(),
});
