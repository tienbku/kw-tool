import { CheerioAPI } from 'cheerio';
import { cleanKeyword } from '../keyword';

export const getBolded = ($cheerio: CheerioAPI): string[] => {
  const texts: string[] = [];
  const strong = $cheerio('strong,b');

  strong.each((_, bold) => {
    const text = $cheerio(bold).text();
    if (text) {
      texts.push(text);
    }
  });

  return texts.map((alt) => cleanKeyword(alt, false, true)).filter((text) => text !== '');
};
