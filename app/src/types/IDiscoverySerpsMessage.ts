import { ObjectId } from 'mongodb';

export interface IDiscoverySerpsMessage {
  seed?: string;
  taskUuid: string;
  reportId: ObjectId;
  location: string;
  language: string;
  keywords: string[];
  searchEngine: string;
  serpLocation: string;
  easyWinsDefaults?: boolean;
  easyWinsPatterns?: string[];
}
