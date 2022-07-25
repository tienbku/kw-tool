export const REPORT_TYPE_DISCOVERY = 'discovery' as const;
export const REPORT_TYPE_SERP_ANALYSIS = 'serp_analysis' as const;

export type IReportType = typeof REPORT_TYPE_DISCOVERY | typeof REPORT_TYPE_SERP_ANALYSIS;
