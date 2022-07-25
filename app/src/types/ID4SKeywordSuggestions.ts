import { ID4SKeywordItem } from './ID4SKeywordItem';

export interface ID4SKeywordSuggestions {
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
      seed_keyword: string;
      seed_keyword_data: ID4SKeywordItem;
      location_code: number;
      language_code: string;
      total_count: number;
      items_count: number;
      items: ID4SKeywordItem[];
    }[];
  }[];
}
