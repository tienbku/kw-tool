import { CheerioAPI } from 'cheerio';
import { cleanKeyword } from '../keyword';

export const getAlts = ($cheerio: CheerioAPI): string[] => {
  const texts: string[] = [];
  const images = $cheerio('img');

  images.each((_, image) => {
    const alt = $cheerio(image).attr('alt');
    if (alt) {
      texts.push(alt);
    }
  });

  return texts.map((alt) => cleanKeyword(alt, false, true)).filter((text) => text !== '');
};
