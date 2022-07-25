import { uniq } from 'lodash';
import { callPy } from '../../shared/py';
import { getGoogleSuggest } from '../../shared/suggest';
import { IDiscovery } from '../../types/IDiscovery';

export const getExtraSuggestions = async (
  report: Pick<IDiscovery, 'searchEngine' | 'language' | 'location'>,
  seed: string,
  suggestions: string[],
) => {
  const extras: string[] = [];

  const pyResponse = await callPy<{ keywords: string[] }, { keywords: string[]; seed: string }>('modified-keywords.py', {
    data: { keywords: suggestions, seed },
  });
  const withModifiers = uniq(pyResponse?.keywords || []);

  for (const keyword of withModifiers) {
    const newSuggestions = await getGoogleSuggest(keyword, report.searchEngine, report.language, report.location, keyword.length - 1);
    if (newSuggestions.length > 0) {
      extras.push(...newSuggestions);
    }
  }

  return uniq(extras);
};
