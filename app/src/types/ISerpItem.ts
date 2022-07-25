import { ISerpFeature } from './ISerpFeature';

export interface ISerpItem {
  url?: string;
  title: string;
  domain: string;
  type: ISerpFeature;
  breadcrumb: string;
  rank_group: number;
  description: string;
  rank_absolute: number;
  highlighted?: string[];
  extended_snippet?: string;
  position: 'left' | 'right';
  extended_people_also_search?: string[];
  related_image_searches?: Array<{
    title: string;
  }>;
  items:
    | string[]
    | Array<{
        title: string;
        question_text: string;
      }>;
  about_this_result: {
    source: string;
    source_url: string;
    source_info: string;
    search_terms: string[];
    related_terms: string[];
  };

  is_image: boolean;
  is_video: boolean;
  is_web_story: boolean;
  is_featured_snippet: boolean;
}
