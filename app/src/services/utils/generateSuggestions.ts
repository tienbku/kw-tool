import { getSuggestionsForWildcard } from './getSuggestionsForWildcard';
import { getSuggestionsForQuestions } from './getSuggestionsForQuestions';

import { IDiscovery } from '../../types/IDiscovery';
import { ISuggestion } from '../../types/ISuggestion';
import { SEARCH_TYPE_CUSTOM, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_WILDCARD } from '../../types/IDiscoverySearchType';
import { getExtraSuggestions } from './getExtraSuggestions';
import { uniqBy } from 'lodash';

export const generateSuggestions = async (
  rootSeed: string,
  report: Pick<IDiscovery, '_id' | 'location' | 'language' | 'searchEngine' | 'searchType'>,
  keywords: string[],
) => {
  let suggestions: ISuggestion[] = [];
  if (report.searchType === SEARCH_TYPE_QUESTIONS) {
    suggestions = await getSuggestionsForQuestions(rootSeed, report);
  } else if (report.searchType === SEARCH_TYPE_WILDCARD) {
    suggestions = await getSuggestionsForWildcard(rootSeed, report);
  } else if (report.searchType === SEARCH_TYPE_CUSTOM) {
    suggestions = keywords.map((kw) => ({ suggestion: kw, modifier: {}, seed: kw }));
  }

  if (suggestions.length > 0 && report.searchType === SEARCH_TYPE_QUESTIONS) {
    const extras = await getExtraSuggestions(
      report,
      rootSeed,
      suggestions.map((sug) => sug.suggestion),
    );
    if (extras.length > 0) {
      console.log(`[discovery-suggest]: Got ${extras.length} extra suggestions`);

      suggestions.push(
        ...extras.map((extra) => ({
          suggestion: extra,
          seed: rootSeed,
          modifier: {
            original: extra,
          },
        })),
      );
    }

    suggestions = suggestions.filter((sug) => {
      return sug.suggestion.split(' ').length <= 10 && sug.suggestion.includes(rootSeed);
    });
  } else if (suggestions.length > 0 && report.searchType === SEARCH_TYPE_WILDCARD) {
    suggestions = suggestions.filter((sug) => {
      return sug.suggestion.split(' ').length <= 10;
    });
  }

  return uniqBy(suggestions, (suggest) => suggest.suggestion);
};
