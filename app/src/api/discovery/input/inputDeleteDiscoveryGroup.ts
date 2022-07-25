import { z } from 'zod';

export const inputDeleteDiscoveryGroup = z.object({
  reportId: z.string(),
  group: z.string(),
});

export const outputDeleteDiscoveryGroup = z.object({
  success: z.boolean(),
});
