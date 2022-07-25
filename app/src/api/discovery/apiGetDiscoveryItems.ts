import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { flatten, uniq } from 'lodash';
import { Context } from '../../shared/context';
import { dbGetDiscovery } from '../../db/discovery';
import { IDiscovery } from '../../types/IDiscovery';
import { cleanKeyword } from '../../shared/keyword';
import { getKeywordIntent } from '../../shared/intent';
import { getWordBoundaryRegex } from '../../shared/regex';
import { IDiscoveryItem } from '../../types/IDiscoveryItem';
import { dbGetDiscoveryItemsForReport } from '../../db/discovery-item';
import { DEFAULT_EW_PATTERNS, getItemEwScoreAndMatches } from '../../shared/ewScore';
import { IDiscoveryItemOutput, inputGetDiscoveryItems, outputGetDiscoveryItems } from './input/inputGetDiscoveryItems';

type IDiscoveryReportPartial = Pick<
  IDiscovery,
  '_id' | 'clusters' | 'semanticClusters' | 'competitorPatterns' | 'easyWinsPatterns' | 'easyWinsDefaults'
>;

type IDiscoveryItemPartial = Pick<
  IDiscoveryItem,
  | '_id'
  | 'pills'
  | 'paa'
  | 'bolded'
  | 'competition'
  | 'cpc'
  | 'volume'
  | 'keyword'
  | 'related'
  | 'featuredSnippet'
  | 'urlsTop'
  | 'serpFeatures'
  | 'ewScore'
  | 'ewMatches'
  | 'googleUrl'
  | 'lemmas'
  | 'urlsAll'
>;

export const apiGetDiscoveryItems = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputGetDiscoveryItems>;
}): Promise<z.output<typeof outputGetDiscoveryItems>> => {
  if (!input.reportId) {
    return {
      success: false,
    };
  }

  const finalItems = await getItems(new ObjectId(input.reportId));
  if (!finalItems) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    items: finalItems,
  };
};

export const getItems = async (reportId: ObjectId): Promise<undefined | IDiscoveryItemOutput[]> => {
  const report = await dbGetDiscovery<IDiscoveryReportPartial>(reportId, {
    _id: 1,
    clusters: 1,
    easyWinsPatterns: 1,
    easyWinsDefaults: 1,
    semanticClusters: 1,
    competitorPatterns: 1,
  });
  if (!report) {
    console.error(`[apiGetDiscoveryItems]: No report found for: ${reportId.toString()}`);
    return undefined;
  }

  const items = await dbGetDiscoveryItemsForReport<IDiscoveryItemPartial>(reportId, {
    _id: 1,
    paa: 1,
    pills: 1,
    bolded: 1,
    competition: 1,
    cpc: 1,
    volume: 1,
    keyword: 1,
    related: 1,
    featuredSnippet: 1,
    urlsTop: 1,
    serpFeatures: 1,
    ewScore: 1,
    lemmas: 1,
    ewMatches: 1,
    googleUrl: 1,
    urlsAll: 1,
  });

  if (!items) {
    console.error(`[apiGetDiscoveryItems]: No items found for: ${reportId.toString()}`);
    return undefined;
  }

  const patterns: string[] = [];
  if (report.easyWinsDefaults) {
    patterns.push(...DEFAULT_EW_PATTERNS);
  }
  if (report.easyWinsPatterns && report.easyWinsPatterns.length > 0) {
    patterns.push(...report.easyWinsPatterns);
  }

  const sClusters = report.semanticClusters || {};
  const allPaa = flatten(items.map((item) => item.paa).filter((paa) => paa !== undefined)).map((paa) => cleanKeyword(paa || ''));
  return items.map(extractItem(report, patterns, allPaa, sClusters));
};

const extractItem =
  (report: IDiscoveryReportPartial, patterns: string[], allPaa: string[], sClusters: Record<string, string[]>) =>
  (item: IDiscoveryItemPartial) => {
    const semanticClusters = Object.keys(sClusters).filter((keyword) => sClusters[keyword].includes(item.keyword));
    const clusters = (report.clusters || [])
      .filter((cluster) => cluster.similar.some((sim) => sim.keyword === item.keyword))
      .map((cluster) => cluster.keyword);

    let titleExactMatch: undefined | boolean;
    if (item.urlsTop) {
      titleExactMatch = item.urlsTop?.some((url) => {
        const reg = getWordBoundaryRegex(item.keyword);
        const cleanTitle = cleanKeyword(url.title);
        return url.title && reg.test(cleanTitle);
      });
    }

    let titlePartialMatch: undefined | boolean;
    if (!titleExactMatch && item.urlsTop) {
      titlePartialMatch = item.urlsTop?.some((url) => url.title && cleanKeyword(url.title).includes(item.keyword));
    }

    const competitors: string[] = [];
    if (item.urlsTop && report.competitorPatterns) {
      for (const pattern of report.competitorPatterns) {
        for (const pos of item.urlsTop) {
          if (pos.url && pos.url.includes(pattern)) {
            competitors.push(pattern);
          }
        }
      }
    }

    const intents = getKeywordIntent(item.keyword);

    const { ewScore, ewMatches } = getItemEwScoreAndMatches(item.urlsTop, patterns);

    return {
      ...item,
      ewScore,
      clusters,
      ewMatches,
      titleExactMatch,
      intent: intents,
      semanticClusters,
      titlePartialMatch,
      urlsAll: item.urlsAll,
      _id: item._id.toString(),
      lemmas: item.lemmas || [],
      competitors: uniq(competitors),
      isPaa: allPaa.includes(item.keyword),
      featuredSnippet: item.featuredSnippet
        ? {
            title: item.featuredSnippet.title,
            url: item.featuredSnippet.url || '',
            position: item.featuredSnippet.position,
            description: item.featuredSnippet.description || '',
          }
        : undefined,
      cpc: typeof item.cpc === 'string' ? parseFloat(item.cpc) : item.cpc,
      competition: typeof item.competition === 'string' ? parseFloat(item.competition) : item.competition,
      analysis: undefined,
      urlsTop: item.urlsTop
        ? item.urlsTop.map((pos) => ({
            title: pos.title,
            url: pos.url || '',
            position: pos.position,
            description: pos.description || '',
          }))
        : undefined,
    };
  };
