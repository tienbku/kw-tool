import { ISerpFeature } from './ISerpFeature';
import { ISerpItem } from './ISerpItem';

export interface ISerpData {
  cost: number;
  time: string;
  check_url: string;
  items: ISerpItem[];
  total_results: number;
  item_types: ISerpFeature[];
}
