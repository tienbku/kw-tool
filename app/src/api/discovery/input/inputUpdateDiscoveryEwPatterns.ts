import { z } from 'zod';

export const inputUpdateDiscoveryEwPatterns = z.object({
  reportId: z.string(),
  ewDefaults: z.boolean(),
  ewPatterns: z.array(z.string()),
});

export const outputUpdateDiscoveryEwPatterns = z.object({
  success: z.boolean(),
});
