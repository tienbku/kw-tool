export const getWordBoundaryRegex = (word: string): RegExp => {
  return new RegExp(`(?<!-)\\b${word}\\b`, 'gi');
};

export const getWordBoundaryRegexString = (word: string): string => {
  return `(?<!-)\\b${word}\\b`;
};
