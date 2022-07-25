import { CheerioAPI } from 'cheerio';
import { cleanKeyword } from '../keyword';

export const getHeadings = ($cheerio: CheerioAPI, number: '1' | '2' | '3' | '4' | '5' | '6'): string[] => {
  const texts: string[] = [];
  const headers = $cheerio(`h${number}`);

  headers.each((_, header) => {
    const text = $cheerio(header).text();
    if (text) {
      texts.push(text);
    }
  });

  return texts.map((alt) => cleanKeyword(alt, false, true)).filter((text) => text.trim() !== '');
};
