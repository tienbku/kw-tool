export interface ID4SRankedKeywords {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks?: {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: { [key: string]: any };
    result: {
      target: string;
      location_code: number;
      language_code: string;
      total_count: number;
      items_count: number;
      metrics: {
        organic: {
          pos_1: number;
          pos_2_3: number;
          pos_4_10: number;
          pos_11_20: number;
          pos_21_30: number;
          pos_31_40: number;
          pos_41_50: number;
          pos_51_60: number;
          pos_61_70: number;
          pos_71_80: number;
          pos_81_90: number;
          pos_91_100: number;
          etv: number;
          impressions_etv: number;
          count: number;
          estimated_paid_traffic_cost: number;
        };
        paid: {
          pos1: number;
          pos_2_3: number;
          pos_4_10: number;
          pos_11_20: number;
          pos_21_30: number;
          pos_31_40: number;
          pos_41_50: number;
          pos_51_60: number;
          pos_61_70: number;
          pos_71_80: number;
          pos_81_90: number;
          pos_91_100: number;
          etv: number;
          impressions_etv: number;
          count: number;
          estimated_paid_traffic_cost: number;
        };
      };
      items: {
        keyword_data: {
          keyword: string;
          location: number;
          language: string;
          keyword_info: {
            last_updated_time: string;
            competition: number;
            cpc: number | null;
            search_volume: number;
            categories: null | number[];
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
            ad_position_min: null | number;
            ad_position_max: null | number;
            ad_position_average: null | number;
            cpc_min: null | number;
            cpc_max: null | number;
            cpc_average: null | number;
            daily_impressions_min: null | number;
            daily_impressions_max: null | number;
            daily_impressions_average: null | number;
            daily_clicks_min: null | number;
            daily_clicks_max: null | number;
            daily_clicks_average: null | number;
            daily_cost_min: null | number;
            daily_cost_max: null | number;
            daily_cost_average: null | number;
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
        };
        ranked_serp_element: {
          serp_item: {
            check_url: string;
            serp_item_types: string[];
            se_results_count: string;
            last_updated_time: string;
            type: string;
            rank_group: number;
            rank_absolute: number;
            position: string;
            xpath: string;
            domain: string;
            title: string;
            url: string;
            phone: string;
            breadcrumb: string;
            is_paid: boolean;
            is_image: boolean;
            is_video: boolean;
            is_featured_snippet: boolean;
            is_malicious: boolean;
            description: string;
            pre_snippet: string;
            extended_snippet: string;
            amp_version: string;
            rating: {
              rating_type: string;
              value: number;
              votes_count: number;
              rating_max: number;
            }[];
            highlighted: string[];
            links: {
              url: string;
              type: string;
              title: string;
              description: string;
            }[];
            main_domain: string;
            relative_url: string;
            etv: number;
            impressions_etv: number;
            estimated_paid_traffic_cost: number;
            extra: {
              ad_aclk: string;
            };
            description_rows: null;
          };
        };
      }[];
    }[];
  }[];
}
