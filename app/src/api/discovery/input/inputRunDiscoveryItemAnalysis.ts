import { z } from 'zod';

export const inputRunDiscoveryItemAnalysis = z.object({
  keyword: z.string(),
  reportId: z.string(),
});

export const outputRunDiscoveryItemAnalysis = z.object({
  success: z.boolean(),
});
