import { z } from 'zod';

export const inputUpdateDiscoveryCompetitors = z.object({
  reportId: z.string(),
  competitors: z.array(z.string()),
});

export const outputUpdateDiscoveryCompetitors = z.object({
  success: z.boolean(),
});
