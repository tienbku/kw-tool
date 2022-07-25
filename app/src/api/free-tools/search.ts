import { Request, Response } from 'express';
import { LANGUAGES } from '../../data-sources/free-tools/languages';
import { LOCATIONS } from '../../data-sources/free-tools/locations';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createUule = require('create-uule');

export const search = async (req: Request, res: Response) => {
  const location = req.body.location as string;
  const language = req.body.language as string;
  const domain = req.body.domain as string;

  if (!location || !language || !domain) {
    res.json({});
    return;
  }

  let country = 'us';
  for (const loc of LOCATIONS) {
    if (loc.location_name === location) {
      country = loc.country_iso_code;
    }
  }

  let lang = 'en';
  for (const lan of LANGUAGES) {
    if (lan.language_name === language) {
      lang = lan.language_code;
    }
  }

  res.json({
    google: getGoogleUrl({
      domain,
      location,
      language: lang,
      country: country.toLowerCase(),
    }),
    bing: getBingUrl({
      country,
      language: lang,
    }),
  });
};
export const getGoogleUrl = (options: { domain: string; country: string; location: string; language: string }) => {
  const hash = createUule(options.location);
  return `https://${options.domain ? options.domain : 'google.com'}/search?sourceid=chrome&ie=UTF-8&oe=UTF-8&hl=${(
    options.language || ''
  ).toLowerCase()}&gl=${(options.country || options.location).toUpperCase()}&uule=${hash}`;
};

export const getBingUrl = (options: { country: string; language: string }) => {
  return `https://www.bing.com/search?mkt=${(options.language || 'en').toLowerCase()}-${(options.country || 'us').toUpperCase()}&setLang=${
    options.language
  }`;
};
