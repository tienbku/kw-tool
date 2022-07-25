import { IHeadings } from './IHeadings';

export interface IDiscoveryAnalysisCorrelation {
  page: number;
  mean: number;
  counts: number[];
}

export interface IDiscoveryAnalysisPage {
  url: string;
  title: string;
  alts: string[];
  content: string;
  bolded: string[];
  anchors: string[];
  wordCount: number;
  description: string;
  headings: IHeadings;
  cleanContent: string;
  characterCount: number;
  terms: Record<string, number>;
}

export interface IDiscoveryAnalysisTerm {
  term: string;
  count: number;
  correlation: number;
  correlationPerPage: IDiscoveryAnalysisCorrelation[];
}

export interface IDiscoveryItemAnalysis {
  urls: string[];
  emptyUrls: string[];
  pages: IDiscoveryAnalysisPage[];
  terms: IDiscoveryAnalysisTerm[];
  termsPerUrl: Record<string, Record<string, number>>;
}
