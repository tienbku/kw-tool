import { z } from 'zod';

export const inputGetDiscoveryItems = z
  .object({
    reportId: z.string(),
  })
  .required();

export const item = z.object({
  _id: z.string(),
  keyword: z.string(),
  cpc: z.number().optional(),
  isPaa: z.boolean().optional(),
  volume: z.number().optional(),
  ewScore: z.number().optional(),
  googleUrl: z.string().optional(),
  paa: z.string().array().optional(),
  competition: z.number().optional(),
  analysis: z.undefined().optional(),
  hasAnalysis: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  pills: z.array(z.string()).optional(),
  lemmas: z.array(z.string()).optional(),
  rankingPosition: z.number().optional(),
  bolded: z.array(z.string()).optional(),
  intent: z.array(z.string()).optional(),
  related: z.array(z.string()).optional(),
  titleExactMatch: z.boolean().optional(),
  clusters: z.array(z.string()).optional(),
  titlePartialMatch: z.boolean().optional(),
  ewMatches: z.array(z.string()).optional(),
  serpFeatures: z.string().array().optional(),
  competitors: z.array(z.string()).optional(),
  semanticClusters: z.array(z.string()).optional(),
  featuredSnippet: z
    .object({
      title: z.string(),
      url: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  urlsAll: z
    .array(
      z.object({
        url: z.string(),
        position: z.number(),
      }),
    )
    .optional(),
  urlsTop: z
    .array(
      z.object({
        title: z.string(),
        position: z.number(),
        url: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export const outputGetDiscoveryItems = z.object({
  success: z.boolean(),
  items: z.array(item).optional(),
});

export type IDiscoveryItemOutput = z.infer<typeof item>;
