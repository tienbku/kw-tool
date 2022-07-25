import { getPartsAndWords } from '../../shared/text';
import { getCurrentMonth, getCurrentYear } from '../../shared/ymd';

import { IDiscovery } from '../../types/IDiscovery';
import { IDiscoveryItem } from '../../types/IDiscoveryItem';
import { dbCreateDiscoveryItem, dbGetDiscoveryItem, dbUpdateDiscoveryItem } from '../../db/discovery-item';
import { getLemmas } from './getLemmas';

export const createOrUpdateDiscoveryItem = async (
  report: Pick<IDiscovery, '_id' | 'language' | 'location' | 'searchEngine'>,
  kw: string,
  ngrams: string[],
) => {
  try {
    const lemmas = getLemmas(kw);
    const terms = getPartsAndWords(kw, ngrams);
    const keyword = await dbGetDiscoveryItem<Pick<IDiscoveryItem, 'keyword'>>(report._id, kw, {
      keyword: 1,
    });

    if (keyword) {
      await dbUpdateDiscoveryItem(report._id, keyword.keyword, { terms });
    } else {
      await dbCreateDiscoveryItem({
        terms,
        keyword: kw,
        report: report._id,
        lemmas: lemmas || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        year: getCurrentYear(),
        month: getCurrentMonth(),
        location: report.location,
        language: report.language,
        searchEngine: report.searchEngine,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
