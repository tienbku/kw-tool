import { Request, Response } from 'express';

interface LocationItem {
  location_name: string;
  country_iso_code: string;
}

const MAX_RESULTS = 5;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../data-sources/locations.json');
const available: LocationItem[] = data.tasks[0].result.filter((item: LocationItem) => {
  if (['US', 'CA', 'UK'].includes(item.country_iso_code)) {
    return item;
  }

  return undefined;
});

type Req = Request<Record<string, unknown>, Record<string, unknown>, { search: string }>;
type Res = Response<{ locations: string[] }>;

export const searchLocations = (req: Req, res: Res) => {
  const search = req.body.search || '';
  const possible: string[] = [];

  if (!search) {
    res.json({ locations: [] });
    return;
  }

  for (const location of available) {
    if (location.location_name.toLowerCase().includes(search.toLowerCase())) {
      possible.push(location.location_name);
    }

    if (possible.length >= MAX_RESULTS) {
      break;
    }
  }

  res.send({ locations: possible });
};
