import { ObjectId } from 'mongodb';
import { IDiscoveryTerm } from '../types/IDiscoveryTerm';
import { dbGetDiscoveryItemsForReport } from '../db/discovery-item';
import { IDiscoveryItem } from '../types/IDiscoveryItem';
import { getWordBoundaryRegex } from '../shared/regex';
import { sortBy } from 'lodash';

const MIN_TERM_SIZE = 2;
const MIN_GRAM_COUNT = 5;
const MIN_NGRAM_COUNT = 5;
const IGNORED_TERMS = ['the', 'and', 'you', 'use', 'these', 'there', 'a', 'is', 'in', 'do', 'of', 'are', 'i', 'your'];

const calculateTerms = async (reportId: ObjectId): Promise<IDiscoveryTerm[]> => {
  console.log(`[calculateTerms]: Calculating terms for ${reportId}`);

  const terms: IDiscoveryTerm[] = [];
  const termCounts: Record<string, number> = {};
  const keywords = await dbGetDiscoveryItemsForReport<Pick<IDiscoveryItem, 'terms' | 'keyword'>>(reportId, {
    terms: 1,
    keyword: 1,
  });

  for (const keyword of keywords || []) {
    if (!keyword) {
      continue;
    }

    for (const part of keyword.terms) {
      if (part.length <= MIN_TERM_SIZE) {
        continue;
      }

      const regex = getWordBoundaryRegex(part.replace(/_/g, ' '));
      if (!regex.test(keyword.keyword)) {
        continue;
      }

      if (!termCounts[part]) {
        termCounts[part] = 0;
      }
      termCounts[part]++;
    }
  }

  const grams = Object.keys(termCounts).filter((term) => term.replace(/_/g, ' ').split(' ').length === 1);
  const ngrams = Object.keys(termCounts).filter((term) => term.replace(/_/g, ' ').split(' ').length > 1);
  const others: IDiscoveryTerm = {
    count: 0,
    children: [],
    term: '_others',
  };

  for (const gram of grams) {
    if (termCounts[gram] < MIN_GRAM_COUNT || IGNORED_TERMS.includes(gram)) {
      continue;
    }

    const children: IDiscoveryTerm[] = [];
    const cleanGram = gram.trim().replace(/_/g, ' ');

    for (const ngram of ngrams) {
      const cleanNgram = ngram.trim().replace(/_/g, ' ');
      const ngramParts = cleanNgram.split(' ').filter((p) => !IGNORED_TERMS.includes(p));
      if (termCounts[ngram] < MIN_NGRAM_COUNT || IGNORED_TERMS.includes(ngram) || ngramParts.length < 2) {
        continue;
      }

      const regex = getWordBoundaryRegex(cleanGram);

      if (termCounts[ngram] > MIN_GRAM_COUNT && regex.test(cleanNgram)) {
        children.push({
          term: ngram,
          children: [],
          count: termCounts[ngram],
        });
      }
    }

    if (children.length > 0) {
      terms.push({
        children,
        term: gram,
        count: termCounts[gram],
      });
    } else {
      others.children.push({
        term: gram,
        count: termCounts[gram],
      });
      others.count += termCounts[gram];
    }
  }

  const sortedChildren = terms;
  for (const term of sortedChildren) {
    term.children = sortBy(term.children, (t) => -t.count);
  }

  let sortedTerms = sortBy(sortedChildren, [(term) => -term.count]);
  if (others.children.length > 0) {
    others.children = sortBy(others.children, (t) => -t.count);
    sortedTerms = [others, ...sortedTerms];
  }

  return sortedTerms;
};

export default calculateTerms;
