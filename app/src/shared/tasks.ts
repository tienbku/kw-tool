import { IDiscovery } from '../types/IDiscovery';
import { IReportTask } from 'src/types/IReportTask';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../types/IReportStatus';
import { dbGetDiscovery, dbUpdateDiscovery } from '../db/discovery';
import { ObjectId } from 'mongodb';

const MAX_TASK_AGE_MS = 20 * 60 * 1000;

const isTaskExpired = (task: IReportTask): boolean => {
  const taskStartTime = task.startDate;
  const taskAge = Date.now() - taskStartTime.getTime();
  return taskAge >= MAX_TASK_AGE_MS;
};

export const cleanUpReportTasks = async (reportId: ObjectId): Promise<IReportTask[] | undefined> => {
  const report = await dbGetDiscovery<Pick<IDiscovery, '_id' | 'tasks'>>(reportId, {
    _id: 1,
    tasks: 1,
  });

  if (!report) {
    return [];
  }

  let updated = 0;
  let removed = 0;
  let ignored = 0;
  const newTasks: IReportTask[] = [];

  for (const task of report.tasks) {
    const taskExpired = isTaskExpired(task);
    if (taskExpired && (task.status === REPORT_STATUS_PROCESSING || task.status === REPORT_STATUS_QUEUED)) {
      updated++;
      newTasks.push({
        ...task,
        status: REPORT_STATUS_ERROR,
      });
    } else if (taskExpired && (task.status === REPORT_STATUS_ERROR || task.status === REPORT_STATUS_COMPLETED)) {
      removed++;
    } else {
      ignored++;
      newTasks.push(task);
    }
  }

  if (updated > 0 || removed > 0) {
    console.log(`[cleanUpReportTasks]: Ignored ${ignored}, Updated ${updated}, Deleted ${removed} tasks for ${reportId.toString()}`);
  }

  await dbUpdateDiscovery(report._id, { tasks: newTasks });

  return newTasks;
};
