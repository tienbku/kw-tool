import axios from 'axios';

import { IKeywordsEverywhereVolumeResponse } from '../types/IKeywordsEverywhereVolumeResponse';

export const getKEKeyword = async (
  kw: string[],
  currency: string,
  country: string,
  dataSource: string,
): Promise<IKeywordsEverywhereVolumeResponse | undefined> => {
  const params = new URLSearchParams();
  params.append('country', country);
  params.append('currency', currency.toUpperCase());
  params.append('dataSource', dataSource);

  for (const k of kw) {
    if (k) {
      params.append('kw[]', k);
    }
  }

  // https://api.keywordseverywhere.com/docs/#/keywords/get_keywords_data
  const response = await axios.post('https://api.keywordseverywhere.com/v1/get_keyword_data', params, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.KE_KEY}`,
    },
  });

  if (response && response.data && response.status === 200) {
    const data: IKeywordsEverywhereVolumeResponse = response.data;
    if (data) {
      return data;
    }
  } else {
    console.error('Keywords Everywhere status is: ' + response.status);
  }

  return undefined;
};
