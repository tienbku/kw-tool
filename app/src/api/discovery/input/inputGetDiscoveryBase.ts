import { z } from 'zod';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../../../types/IReportStatus';

export const inputGetDiscoveryBase = z
  .object({
    reportId: z.string(),
  })
  .required();

const report = z
  .object({
    _id: z.string(),
    name: z.string(),
    language: z.string(),
    hasTopicMap: z.boolean(),
    seed: z.string().optional(),
    easyWinsPatterns: z.array(z.string()),
    verbs: z.array(z.string()).optional(),
    competitorPatterns: z.array(z.string()),
    easyWinsDefaults: z.boolean().optional(),
    easyWinsPatternsUser: z.array(z.string()).optional(),
    status: z.enum([REPORT_STATUS_ERROR, REPORT_STATUS_QUEUED, REPORT_STATUS_COMPLETED, REPORT_STATUS_PROCESSING]),
    groups: z
      .array(
        z.object({
          name: z.string(),
          count: z.number(),
          keywords: z.array(z.string()),
        }),
      )
      .optional(),
    terms: z
      .array(
        z.object({
          term: z.string(),
          count: z.number(),
          children: z.array(
            z.object({
              term: z.string(),
              count: z.number(),
            }),
          ),
        }),
      )
      .optional(),
  })
  .optional();

export const outputGetDiscoveryBase = z.object({
  report,
  success: z.boolean(),
  id: z.string().optional(),
});

export type IDiscoveryBaseOutput = z.infer<typeof report>;
