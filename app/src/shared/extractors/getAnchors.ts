import { CheerioAPI } from 'cheerio';
import { cleanKeyword } from '../keyword';

export const getAnchors = ($cheerio: CheerioAPI): string[] => {
  const texts: string[] = [];
  const a = $cheerio('a');

  a.each((_, anchor) => {
    const href = $cheerio(anchor).attr('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('javascript:') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('data:')
    ) {
      const text = $cheerio(anchor).text();
      if (text) {
        texts.push(text);
      }
    }
  });

  return texts.map((alt) => cleanKeyword(alt, false, true)).filter((text) => text !== '');
};
