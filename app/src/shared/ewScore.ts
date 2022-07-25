import { uniq } from 'lodash';
import { IDiscoverySerpItem } from '../types/IDiscoverySerpItem';

export const DEFAULT_EW_PATTERNS = uniq([
  '\\/ask\\/questions\\/',
  'reddit.com',
  'linkedin.com',
  'pinterest.com',
  'udemy.com',
  'quora.com',
  '\\/forum',
  '\\/community',
  'answers.yahoo.com',
  'wikihow.com',
  'blogspot.com',
  'findanyanswer.com',
  'stackexchange.com',
  'facebook.com',
  'askinglot.com',
  'twitter.com',
  'tripadvisor.com',
  'wordpress.com',
  'livejournal.com',
  'askinglot.com',
  'topic.aspx',
  'showthread.php',
  '\\/search\\/',
  'www.answers.com',
  'citi-data.com',
  'visihow.com',
  'fluther.com',
  'ask.metafilter.com',
  'everythingwhat.com',
  '\\/threads',
  '\\?threads',
  '\\/boards.',
  '.pdf$',
]);

export const getItemEwScoreAndMatches = (urlsTop: undefined | IDiscoverySerpItem[], patterns: string[]) => {
  let ewMatches: string[] = [];
  let ewScore: undefined | number;
  if (urlsTop) {
    const { ewScore: tmpEwScore, matches: tmpEwMatches } = calculateEasyWinScore(
      urlsTop.map((item) => item.url || ''),
      patterns,
    );
    ewScore = tmpEwScore;
    ewMatches = tmpEwMatches;
  }

  return {
    ewScore,
    ewMatches,
  };
};

export const calculateEasyWinScore = (urls: string[], patterns: string[]): { ewScore: number; matches: string[] } => {
  let score = 0;
  const matches: string[] = [];

  for (const url of urls) {
    for (const pattern of patterns) {
      const _matches = url.match(new RegExp(pattern, 'gi'));
      if (_matches && _matches.length > 0) {
        const match = _matches[0];
        matches.push(match);
        score += 1;
        break;
      }
    }
  }

  return {
    ewScore: score,
    matches: uniq(matches),
  };
};
