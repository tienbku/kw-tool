import { z } from 'zod';

export const inputGetDiscoverySerps = z.object({
  reportId: z.string(),
  keywords: z.array(z.string()),
});

export const outputGetDiscoverySerps = z.object({
  success: z.boolean(),
});
