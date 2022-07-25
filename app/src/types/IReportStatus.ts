export const REPORT_STATUS_ERROR = 'error' as const;
export const REPORT_STATUS_QUEUED = 'queued' as const;
export const REPORT_STATUS_PROCESSING = 'processing' as const;
export const REPORT_STATUS_COMPLETED = 'completed' as const;

export const REPORT_STATUSES = [REPORT_STATUS_ERROR, REPORT_STATUS_QUEUED, REPORT_STATUS_COMPLETED, REPORT_STATUS_PROCESSING] as const;

export type IReportStatus =
  | typeof REPORT_STATUS_QUEUED
  | typeof REPORT_STATUS_PROCESSING
  | typeof REPORT_STATUS_COMPLETED
  | typeof REPORT_STATUS_ERROR;
