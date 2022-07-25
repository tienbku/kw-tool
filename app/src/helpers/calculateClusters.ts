import { sortBy, sum } from 'lodash';
import { IDiscovery } from '../types/IDiscovery';
import { getTopicsFromKeywords } from '../shared/topics';
import { IDiscoveryItem } from '../types/IDiscoveryItem';
import type { IDiscoveryClusterOutput } from '../api/discovery/input/inputGetDiscoveryClusters';

type IItem = Pick<IDiscoveryItem, 'keyword' | 'urlsTop' | 'volume' | 'ewScore'>;

export const calculateClusters = async (
  reportId: string,
  seed: string | undefined,
  allKeywords: IItem[],
  report: Pick<IDiscovery, 'serpSimilarity'>,
): Promise<{ clusters: IDiscoveryClusterOutput[]; topics: Record<string, string[]> }> => {
  if (!report.serpSimilarity || Object.keys(report.serpSimilarity).length === 0) {
    console.log(`[calculateClusters]: No serpSimilarity found for ${reportId}`);
    return { clusters: [], topics: {} };
  }

  console.log(`[calculateClusters]: Calculating clusters for ${reportId}`);

  const kwIdeas: Record<string, string[]> = {};
  const keys = Object.keys(report.serpSimilarity);
  const keysSortedByVolume = sortBy(keys, (key) => {
    const item = allKeywords.find((i) => i.keyword === key);
    return item ? item.volume : 0;
  }).reverse();

  const processedKeywords: string[] = [];
  const clusters: IDiscoveryClusterOutput[] = [];
  for (const key of keysSortedByVolume) {
    const item = allKeywords.find((i) => i.keyword === key);
    if (!item || processedKeywords.includes(key)) {
      continue;
    }

    const currentSimilar = report.serpSimilarity[key].high;
    processedKeywords.push(key);
    processedKeywords.push(...currentSimilar);

    const similar: Array<{ keyword: string; volume: number }> = sortBy(
      [...currentSimilar, key].map((kw) => {
        const similarItem = allKeywords.find((d) => d.keyword === kw);
        return {
          keyword: kw,
          volume: similarItem?.volume || 0,
        };
      }),
      (d) => -d.volume,
    );

    const tags = getTopicsFromKeywords(seed, [key, ...similar.map((d) => d.keyword)]);

    kwIdeas[key] = tags;
    for (const sim of similar) {
      kwIdeas[sim.keyword] = tags;
    }

    const cluster: IDiscoveryClusterOutput = {
      tags,
      similar,
      keyword: key,
      volume: sum(similar.map((d) => d.volume)),
    };

    if (similar.length > 1) {
      clusters.push(cluster);
    }
  }

  return { clusters, topics: kwIdeas };
};
