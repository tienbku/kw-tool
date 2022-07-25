import { IDiscovery } from './IDiscovery';

export type IDiscoveryBase = Pick<
  IDiscovery,
  | '_id'
  | 'verbs'
  | 'language'
  | 'name'
  | 'seed'
  | 'status'
  | 'terms'
  | 'groups'
  | 'easyWinsPatterns'
  | 'easyWinsDefaults'
  | 'competitorPatterns'
>;
