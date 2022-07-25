export const PAA = 'people_also_ask' as const;
export const ORGANIC = 'organic' as const;
export const FEATURED_SNIPPET = 'featured_snippet';

export type ISerpFeature =
  | typeof ORGANIC
  | typeof PAA
  | typeof FEATURED_SNIPPET
  | 'youtube'
  | 'answer_box'
  | 'app'
  | 'carousel'
  | 'multi_carousel'
  | 'google_flights'
  | 'google_reviews'
  | 'google_posts'
  | 'images'
  | 'jobs'
  | 'knowledge_graph'
  | 'local_pack'
  | 'math_solver'
  | 'hotels_pack'
  | 'map'
  | 'paid'
  | 'related_searches'
  | 'people_also_search'
  | 'shopping'
  | 'top_stories'
  | 'twitter'
  | 'video'
  | 'events'
  | 'mention_carousel'
  | 'recipes'
  | 'top_sights'
  | 'scholarly_articles'
  | 'popular_products'
  | 'podcasts'
  | 'questions_and_answers'
  | 'find_results_on'
  | 'stocks_box'
  | 'visual_stories'
  | 'commercial_units'
  | 'local_services'
  | 'google_hotels'
  | 'currency_box';
