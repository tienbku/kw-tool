import { Request, Response } from 'express';
import { LOCATIONS } from '../../data-sources/free-tools/locations';
import { LANGUAGES } from '../../data-sources/free-tools/languages';
import { GOOGLE_DOMAINS } from '../../data-sources/free-tools/google-domains';
import { GOOGLE_COUNTRIES } from '../../data-sources/free-tools/google-countries';

export const getLocations = (req: Request, res: Response) => {
  const locations: { value: string }[] = [];
  let search = req.body.search as string;

  if (search) {
    search = search.toLowerCase().trim();

    let i = 0;
    for (const loc of LOCATIONS) {
      if (loc.location_name.toLowerCase().includes(search)) {
        locations.push({
          value: loc.location_name,
        });
        i++;
      }

      if (i > 4) {
        break;
      }
    }
  }

  res.json({
    locations,
  });
};

export const getLanguages = (req: Request, res: Response) => {
  const languages: string[] = [];
  let search = req.body.search as string;

  if (search) {
    search = search.toLowerCase().trim();

    let i = 0;
    for (const lan of LANGUAGES) {
      if (lan.language_name.toLowerCase().includes(search)) {
        languages.push(lan.language_name);
        i++;
      }

      if (i > 4) {
        break;
      }
    }
  }

  res.json({
    languages: languages.map((l) => ({ value: l })),
  });
};

export const getCountries = (req: Request, res: Response) => {
  const countries: { value: string; label: string }[] = [];
  let search = req.body.search as string;

  if (search) {
    search = search.toLowerCase().trim();

    let i = 0;
    for (const cr of GOOGLE_COUNTRIES) {
      if (cr.country_name.toLowerCase().includes(search)) {
        countries.push({
          value: cr.country_code,
          label: cr.country_name,
        });
        i++;
      }

      if (i > 4) {
        break;
      }
    }
  }

  res.json({
    countries,
  });
};

export const getDomains = (req: Request, res: Response) => {
  const domains: { value: string }[] = [];
  let search = req.body.search as string;

  if (search) {
    search = search.toLowerCase().trim();

    let i = 0;
    for (const domain of GOOGLE_DOMAINS) {
      if (domain.domain.includes(search)) {
        domains.push({
          value: domain.domain,
        });
        i++;
      }

      if (i > 4) {
        break;
      }
    }
  }

  res.json({
    domains,
  });
};
