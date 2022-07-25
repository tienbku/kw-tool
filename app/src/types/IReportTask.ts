import { IReportStatus } from './IReportStatus';
import { IQueueType } from './IQueueType';

export interface IReportTask {
  uuid: string;
  endDate?: Date;
  startDate: Date;
  type: IQueueType;
  status: IReportStatus;
}

export type IReportTaskResponse = Omit<IReportTask, 'startDate' | 'endDate' | 'type'>;
