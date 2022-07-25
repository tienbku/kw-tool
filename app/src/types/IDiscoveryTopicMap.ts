import { ObjectId } from 'mongodb';
import { IReportStatus } from './IReportStatus';

export interface ITopicMapEntity {
  name: string;
  mid?: string;
  url?: string;
  wiki?: string;
  entity?: string;
}

export interface ITopicMapItem {
  key: string;
  name: string;
  count: number;
  entities: ITopicMapEntity[];
  clusters: Record<string, string[]>;
}

export interface ITopicCategory {
  key: string;
  name: string;
  keywords: string[];
}

export interface IDiscoveryTopicMap {
  _id: ObjectId;
  reportId: ObjectId;
  status: IReportStatus;

  map: ITopicMapItem[];
  categories: ITopicCategory[];
  hidden: {
    topics: string[];
    clusters: string[];
    keywords: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}
