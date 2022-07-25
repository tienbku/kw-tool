import { z } from 'zod';
import { item } from './inputGetDiscoveryItems';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../../../types/IReportStatus';

export const inputGetTopicMap = z.object({
  reportId: z.string(),
});

const mapItem = z.object({
  key: z.string(),
  name: z.string(),
  count: z.number(),
  clusters: z.record(z.array(z.string())),
  entities: z
    .array(
      z.object({
        name: z.string(),
        mid: z.string().optional(),
        url: z.string().optional(),
        wiki: z.string().optional(),
        entity: z.string().optional(),
      }),
    )
    .optional(),
});

export const outputGetTopicMap = z.object({
  id: z.string(),
  reportId: z.string(),
  map: z.array(mapItem),
  items: z.array(item).optional(),
  categories: z.array(
    z.object({
      key: z.string(),
      name: z.string(),
      keywords: z.array(z.string()),
    }),
  ),
  status: z.enum([REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED, REPORT_STATUS_COMPLETED]),
  hidden: z.object({
    topics: z.array(z.string()),
    clusters: z.array(z.string()),
    keywords: z.array(z.string()),
  }),
});

export type IDiscoveryTopicMapItemOutput = z.infer<typeof mapItem>;
