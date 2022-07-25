import { uniq } from 'lodash';
import { callPy } from '../../shared/py';
import { getWordBoundaryRegex } from '../../shared/regex';

export const getNgrams = async (sentences: string[]): Promise<{ ngrams: string[] }> => {
  const minCount = 2;
  const ngrams: string[] = [];
  const ngramsCounts: Record<string, number> = {};

  const pyNgrams = await callPy<{ ngrams: string[] }, string[]>('ngrams-keywords.py', { data: sentences });
  const pyNgramsClean = uniq(pyNgrams?.ngrams || []);

  for (const sentence of sentences) {
    for (const ngram of pyNgramsClean) {
      const count = (sentence.match(getWordBoundaryRegex(ngram.replace(/_/, ' '))) || []).length;
      for (let i = 0; i < count; i++) {
        ngrams.push(ngram);
      }
    }
  }

  for (const ngram of ngrams) {
    if (ngramsCounts[ngram]) {
      ngramsCounts[ngram] += 1;
    } else {
      ngramsCounts[ngram] = 1;
    }
  }

  const ngramsWithMinCount = Object.keys(ngramsCounts).filter((ngram) => ngramsCounts[ngram] >= minCount);
  return {
    ngrams: uniq(ngramsWithMinCount).map((kw) => kw.trim().replace(/\s+/g, ' ').toLowerCase()),
  };
};
