import { ISerpFeature } from './ISerpFeature';

export interface ID4SResponse {
  cost: number;
  time: string;
  tasks: Array<{
    result: Array<{
      items: any[];
      check_url: string;
      se_results_count: number;
      item_types: ISerpFeature[];
    }>;
  }>;
}
