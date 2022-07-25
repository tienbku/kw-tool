import axios from 'axios';
import { IDiscoveryAnalysisPage } from '../types/IDiscoveryItemAnalysis';
import { extractContent } from '../shared/html';
import { cleanKeyword } from '../shared/keyword';
import { getHeadings } from '../shared/extractors/getHeadings';
import { getBolded } from '../shared/extractors/getBolded';
import { getAnchors } from '../shared/extractors/getAnchors';
import { getAlts } from '../shared/extractors/getAlts';
import { callPy } from '../shared/py';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const RESPONSE_TIMEOUT = 3000;
const EXCLUDED_DOMAINS = [
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'youtube.com',
  'linkedin.com',
  'pinterest.com',
  'www.facebook.com',
  'www.twitter.com',
  'www.instagram.com',
  'www.youtube.com',
  'www.linkedin.com',
  'www.pinterest.com',
];

export const getUrl = async (url: string): Promise<{ url: string; page?: IDiscoveryAnalysisPage }> => {
  for (const exclude of EXCLUDED_DOMAINS) {
    if (url.startsWith(`https://${exclude}`)) {
      console.log(`[serp-analysis]: Excluded domain: ${url}`);
      return { url };
    }
  }

  let html = '';
  try {
    console.log(`[serp-analysis]: Getting content for: ${url} with normal URL`);

    const response = await axios.get(url, {
      timeout: RESPONSE_TIMEOUT,
      headers: { 'User-Agent': process.env.GOOGLE_USER_AGENT || '' },
    });
    if (response.status === 200 && response.data && response.data.trim() !== '') {
      html = response.data;
    }
  } catch (error: any) {
    console.error(`[serp-analysis]: Error getting URL with normal request: ${url}`);
    if (error.message) {
      console.error(error.message);
    }
  }

  if (process.env.BROWSERLESS_API) {
    if (!html) {
      try {
        console.log(`[serp-analysis]: Getting URL with browserless: ${url}`);

        const response = await axios.post(
          `https://chrome.browserless.io/content?blockAds&stealth&token=${process.env.BROWSERLESS_API}`,
          {
            url,
            userAgent: process.env.GOOGLE_USER_AGENT || '',
            gotoOptions: {
              timeout: RESPONSE_TIMEOUT,
            },
          },
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200 && response.data) {
          console.log(`[serp-analysis]: Got HTML from Browserless for ${url}`);
          html = response.data;
        }
      } catch (error: any) {
        console.error(`[serp-analysis]: Error getting URL with BROWSERLESS: ${url}`);
        if (error.message) {
          console.error(error.message);
        }
      }
    }
  } else {
    console.error(`[serp-analysis]: Error getting URL: ${url}, do not have BROWSERLESS_API`);
  }

  let newUrlContent: IDiscoveryAnalysisPage | undefined;

  if (html) {
    const { content, $cheerio } = extractContent(html);

    if (content && content.replace(/\s+/g, ' ').trim().length === 0) {
      console.error(`[serp-analysis]: Empty content for URL: ${url}`);
      return { url };
    }

    const alts: string[] = getAlts($cheerio);
    const bolded: string[] = getBolded($cheerio);
    const anchors: string[] = getAnchors($cheerio);

    const title = $cheerio('head title').text();
    const description = $cheerio('meta[name="description"]').attr('content');

    const cleanContent = content
      .toLowerCase()
      .replace(/'s\b/gi, ' ')
      .replace(/[^a-z\d\s-.]/gi, ' ')
      .replace(/\s+/g, ' ');

    const pyContent = await callPy<{ content: string }, string>('clean-content.py', { data: cleanContent });
    const finalCleanContent = (pyContent ? pyContent.content : cleanContent).trim().replace(/_/g, ' ').trim();

    if (finalCleanContent === '') {
      console.error(`[serp-analysis]: Empty content for URL: ${url}`);
      return { url };
    } else if (finalCleanContent.length < 100) {
      console.error(`[serp-analysis]: Content too short for URL: ${url}`);
      return { url };
    }

    newUrlContent = {
      url,
      alts,
      bolded,
      anchors,
      content,
      terms: {},
      title: cleanKeyword(title),
      cleanContent: finalCleanContent,
      characterCount: finalCleanContent.length,
      description: cleanKeyword(description || ''),
      wordCount: finalCleanContent.split(' ').length,
      headings: {
        h1: getHeadings($cheerio, '1'),
        h2: getHeadings($cheerio, '2'),
        h3: getHeadings($cheerio, '3'),
        h4: getHeadings($cheerio, '4'),
        h5: getHeadings($cheerio, '5'),
        h6: getHeadings($cheerio, '6'),
      },
    };
  }

  if (!newUrlContent) {
    console.error(`[serp-analysis]: Did not get content for URL: ${url}`);
  }

  return { url, page: newUrlContent };
};
