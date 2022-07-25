import { z } from 'zod';

export const inputDeleteDiscovery = z
  .object({
    reportId: z.string(),
  })
  .required();

export const outputDeleteDiscovery = z.object({ success: z.boolean() }).required();
