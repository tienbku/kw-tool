export const GOOGLE_US = 'google.com' as const;
export const GOOGLE_UK = 'google.co.uk' as const;
export const GOOGLE_CANADA = 'google.ca' as const;
export const GOOGLE_ESPANA = 'google.es' as const;
export const GOOGLE_MEXICO = 'google.com.mx' as const;
export const GOOGLE_GUATEMALA = 'google.com.gt' as const;

export const SEARCH_ENGINES = [GOOGLE_US, GOOGLE_UK, GOOGLE_CANADA] as const;
export type IGoogleDomain = typeof GOOGLE_US | typeof GOOGLE_CANADA | typeof GOOGLE_UK;
