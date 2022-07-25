import { z } from 'zod';

export const inputDeleteDiscoveryKeywords = z.object({
  reportId: z.string(),
  keywords: z.array(z.string()),
});

export const outputDeleteDiscoveryKeywords = z.object({
  success: z.boolean(),
});
