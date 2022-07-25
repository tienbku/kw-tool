import { ObjectId } from 'mongodb';
import { ISerpData } from './ISerpData';
import { ISerpFeature } from './ISerpFeature';
import { IKeywordHistory } from './IKeywordHistory';
import { IDiscoverySerpItem } from './IDiscoverySerpItem';
import { IDiscoveryItemAnalysis } from './IDiscoveryItemAnalysis';

export interface IDiscoveryItem {
  _id: ObjectId;
  report: ObjectId;
  keyword: string;
  language: string;
  location: string;
  searchEngine: string;

  paa?: string[];
  terms: string[];
  volume?: number;
  tags?: string[];
  ewScore?: number;
  pills?: string[];
  lemmas?: string[];
  bolded?: string[];
  googleUrl?: string;
  related?: string[];
  serpData?: ISerpData;
  ewMatches?: string[];
  cpc?: number | string;
  serpFeatures?: ISerpFeature[];
  competition?: number | string;
  urlsTop?: IDiscoverySerpItem[];
  analysis?: IDiscoveryItemAnalysis;
  volumeHistory?: IKeywordHistory[];
  featuredSnippet?: IDiscoverySerpItem;
  urlsAll?: Array<{ url: string; position: number }>;

  // Dynamic, calculated on the fly
  isPaa?: boolean;
  titleExactMatch?: boolean;
  titlePartialMatch?: boolean;

  // Dates
  year: string;
  month: string;
  createdAt: Date;
  updatedAt: Date;
  serpUpdatedAt?: Date;
}
