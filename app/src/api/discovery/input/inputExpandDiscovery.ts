import { z } from 'zod';
import { asOptionalField } from '../../../shared/z';
import { SEARCH_TYPE_CUSTOM, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_URL, SEARCH_TYPE_WILDCARD } from '../../../types/IDiscoverySearchType';

export const inputExpandDiscovery = z.object({
  reportId: z.string(),
  url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  seed: asOptionalField(z.string().min(1).max(45)),
  searchType: z.enum([SEARCH_TYPE_WILDCARD, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_CUSTOM, SEARCH_TYPE_URL]),
});

export const outputExpandDiscovery = z.object({
  success: z.boolean(),
});
