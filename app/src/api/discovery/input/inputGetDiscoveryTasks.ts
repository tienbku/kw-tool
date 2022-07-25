import { z } from 'zod';

export const inputGetDiscoveryTasks = z.object({
  reportId: z.string(),
});

export const outputGetDiscoveryTasks = z.object({
  tasks: z.array(
    z.object({
      uuid: z.string(),
      type: z.string(),
      status: z.string(),
    }),
  ),
});
