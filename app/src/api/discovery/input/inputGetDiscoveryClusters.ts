import { z } from 'zod';

export const inputGetDiscoveryClusters = z.object({
  reportId: z.string(),
});

const cluster = z.object({
  keyword: z.string(),
  tags: z.array(z.string()),
  similar: z.array(
    z.object({
      volume: z.number(),
      keyword: z.string(),
    }),
  ),
  volume: z.number(),
});

export const outputGetDiscoveryClusters = z.object({
  clusters: z.array(cluster),
  semanticClusters: z.record(z.array(z.string())),
});

export type IDiscoveryClusterOutput = z.infer<typeof cluster>;
