export const UNITED_STATES_CODE = 'us' as const;
export const CANADA_CODE = 'ca' as const;
export const UNITED_KINGDOM_CODE = 'uk' as const;

export type ICountryType = typeof UNITED_STATES_CODE | typeof CANADA_CODE | typeof UNITED_KINGDOM_CODE;
