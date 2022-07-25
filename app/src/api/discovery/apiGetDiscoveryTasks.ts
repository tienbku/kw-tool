import { Context } from '../../shared/context';
import { inputGetDiscoveryTasks, outputGetDiscoveryTasks } from './input/inputGetDiscoveryTasks';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { cleanUpReportTasks } from '../../shared/tasks';

export const apiGetDiscoveryTasks = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputGetDiscoveryTasks>;
}): Promise<z.output<typeof outputGetDiscoveryTasks>> => {
  const tasks = await cleanUpReportTasks(new ObjectId(input.reportId));

  return {
    tasks: (tasks || []).map((task) => ({
      uuid: task.uuid,
      type: task.type,
      status: task.status,
    })),
  };
};
