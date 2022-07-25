export interface ID4SKeywordItem {
  keyword: string;
  location_code: number;
  language_code: string;
  keyword_info: {
    last_updated_time: string;
    competition: number;
    cpc: number;
    search_volume: number;
    categories: string[];
    monthly_searches: {
      year: number;
      month: number;
      search_volume: number;
    }[];
  };
  impressions_info: {
    last_updated_time: string;
    bid: number;
    match_type: string;
    ad_position_min: number;
    ad_position_max: number;
    ad_position_average: number;
    cpc_min: number;
    cpc_max: number;
    cpc_average: number;
    daily_impressions_min: number;
    daily_impressions_max: number;
    daily_impressions_average: number;
    daily_clicks_min: number;
    daily_clicks_max: number;
    daily_clicks_average: number;
    daily_cost_min: number;
    daily_cost_max: number;
    daily_cost_average: number;
  };
  bing_keyword_info: {
    last_updated_time: string;
    search_volume: number;
    monthly_searches: {
      year: number;
      month: number;
      search_volume: number;
    }[];
  };
}
