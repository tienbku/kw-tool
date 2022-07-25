import { uniq, uniqBy } from 'lodash';

import { sleep } from '../../shared/time';
import { IDiscovery } from '../../types/IDiscovery';
import { ISuggestion } from '../../types/ISuggestion';
import { QUESTIONS } from '../../shared/text';
import { getGoogleSuggest } from '../../shared/suggest';
import { getExtraModifiersFromQuestionSuggestion } from './getExtraModifiersFromQuestionSuggestion';

interface ISuggestionResponse {
  extraModifiers: string[];
  suggestions: ISuggestion[];
}

const POOL_SIZE = 2;

export const getSuggestionsForQuestion = async (
  rootSeed: string,
  report: Pick<IDiscovery, 'location' | 'language' | 'searchEngine'>,
  questionMod: string,
): Promise<ISuggestionResponse> => {
  let extraModifiers: string[] = [];
  const suggestions: ISuggestion[] = [];

  const seed = `${questionMod} ${rootSeed}`;
  const seedA = `${questionMod} ${rootSeed} *`;
  const seedB = `${questionMod} * ${rootSeed} *`;
  const googleSuggestions = await getGoogleSuggest(seed, report.searchEngine, report.language, report.location, seed.length - 1);
  const googleSuggestionsA = await getGoogleSuggest(seedA, report.searchEngine, report.language, report.location, seedA.length - 1);
  const googleSuggestionsB = await getGoogleSuggest(seedB, report.searchEngine, report.language, report.location, seedB.length - 1);

  for (const sug of uniq([...googleSuggestions, ...googleSuggestionsA, ...googleSuggestionsB])) {
    try {
      const extra = getExtraModifiersFromQuestionSuggestion(sug, questionMod, rootSeed);
      if (extra) {
        extraModifiers = [...extraModifiers, ...extra];
      }
    } catch (err) {
      console.error(`Error getting extra modifiers for ${questionMod} ${rootSeed}`);
      console.error(err);
    }

    if (sug !== seed) {
      suggestions.push({
        seed: rootSeed,
        suggestion: sug,
        modifier: {
          pre: questionMod,
        },
      });
    }
  }

  if (extraModifiers.length > 0) {
    extraModifiers = uniq(extraModifiers.filter((extra) => extra.split(' ').length > 1));
    console.log(`[discovery-suggest]: Found ${extraModifiers.length} extra modifiers for ${questionMod}, sample: ${extraModifiers[0]}`);
  }

  return {
    suggestions,
    extraModifiers,
  };
};

const getFirstSuggestions = async (rootSeed: string, report: Pick<IDiscovery, '_id' | 'location' | 'language' | 'searchEngine'>) => {
  let extraModifiers: string[] = [];
  let suggestions: ISuggestion[] = [];

  let tasks: Promise<ISuggestionResponse>[] = [];
  for (const question of QUESTIONS) {
    tasks.push(getSuggestionsForQuestion(rootSeed, report, question));

    if (tasks.length > POOL_SIZE) {
      const results = await Promise.all(tasks);
      for (const result of results) {
        if (result.suggestions) {
          suggestions = [...suggestions, ...result.suggestions];
          extraModifiers = [...extraModifiers, ...result.extraModifiers];
        }
      }

      tasks = [];

      await sleep(500);
    }
  }

  if (tasks.length > 0) {
    const results = await Promise.all(tasks);
    for (const result of results) {
      if (result.suggestions) {
        suggestions = [...suggestions, ...result.suggestions];
        extraModifiers = [...extraModifiers, ...result.extraModifiers];
      }
    }
  }

  console.log(`[discovery-suggest]: Found first ${suggestions.length} suggestions, ${extraModifiers.length} modifiers for ${report._id}`);

  return {
    suggestions,
    extraModifiers: uniq(extraModifiers),
  };
};

const getExtraSuggestions = async (
  rootSeed: string,
  report: Pick<IDiscovery, 'searchEngine' | 'language' | 'location'>,
  question: string,
): Promise<ISuggestion[]> => {
  const suggestions: ISuggestion[] = [];

  const mod = `${question} *`;
  const seed = `${mod} ${rootSeed}`;
  const firstSuggestions = await getGoogleSuggest(seed, report.searchEngine, report.language, report.location, mod.length);
  const secondSuggestions = await getGoogleSuggest(seed, report.searchEngine, report.language, report.location, seed.length);
  for (const sug of uniq([...firstSuggestions, ...secondSuggestions])) {
    if (sug !== `${question} ${rootSeed}`) {
      suggestions.push({
        seed: rootSeed,
        suggestion: sug,
        modifier: {
          wildcard: mod,
        },
      });
    }
  }

  return suggestions;
};

const getSecondSuggestions = async (
  rootSeed: string,
  report: Pick<IDiscovery, '_id' | 'location' | 'language' | 'searchEngine'>,
  extraModifiers: string[],
) => {
  let suggestions: ISuggestion[] = [];

  let tasks: Promise<ISuggestion[]>[] = [];
  for (const question of extraModifiers) {
    tasks.push(getExtraSuggestions(rootSeed, report, question));

    if (tasks.length > POOL_SIZE) {
      const results = await Promise.all(tasks);
      for (const result of results) {
        if (result) {
          suggestions = [...suggestions, ...result];
        }
      }

      tasks = [];

      await sleep(500);
    }
  }

  if (tasks.length > 0) {
    const results = await Promise.all(tasks);
    for (const result of results) {
      if (result) {
        suggestions = [...suggestions, ...result];
      }
    }
  }

  return suggestions;
};

export const getSuggestionsForQuestions = async (
  rootSeed: string,
  report: Pick<IDiscovery, '_id' | 'location' | 'language' | 'searchEngine'>,
): Promise<ISuggestion[]> => {
  const startTime = Date.now();
  const firstSuggestions = await getFirstSuggestions(rootSeed, report);

  console.log(`[discovery-suggest]: Getting extra suggestions for ${rootSeed}`);

  const extraSuggestions = await getSecondSuggestions(rootSeed, report, firstSuggestions.extraModifiers);
  const suggestions = uniqBy([...firstSuggestions.suggestions, ...extraSuggestions], 'suggestion');

  const filteredSuggestions = suggestions.filter((sug) => {
    const firstWord = sug.suggestion.split(' ')[0];
    const includesQuestion = QUESTIONS.includes(firstWord);
    const isNotSeed = sug.suggestion !== rootSeed;
    const withoutSeed = sug.suggestion.replace(rootSeed, '').trim().split(' ');
    const hasMoreThanOneModifier = withoutSeed.length > 1;
    const sugIncludesAllKeywordWords = rootSeed.split(' ').every((word) => sug.suggestion.includes(word));
    return includesQuestion && isNotSeed && hasMoreThanOneModifier && sugIncludesAllKeywordWords;
  });

  console.log(`[discovery-suggest]: Found a total of ${suggestions.length} uniq suggestions for ${rootSeed}`);
  console.log(`[discovery-suggest]: After filtering, found ${filteredSuggestions.length} uniq suggestions for ${rootSeed}`);

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`[discovery-suggest]: Finished getting suggestions, took ${minutes} minutes`);

  return filteredSuggestions;
};
