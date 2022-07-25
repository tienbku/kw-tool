export interface IKeywordsEverywhereVolumeResponse {
  data: {
    vol: number;
    cpc: {
      value: number;
      currency: string;
    };
    keyword: string;
    competition: number;
    trend: {
      year: string;
      month: string;
      value: number;
    }[];
  }[];
  time: number;
  credits: number;
  message?: string;
}
