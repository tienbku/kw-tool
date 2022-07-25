import { Context } from '../../shared/context';
import { z } from 'zod';
import { inputDeleteDiscoveryGroup, outputDeleteDiscoveryGroup } from './input/inputDeleteDiscoveryGroup';
import { dbGetDiscovery, dbUpdateDiscovery } from '../../db/discovery';
import { ObjectId } from 'mongodb';
import { IDiscovery } from '../../types/IDiscovery';

export const apiDeleteDiscoveryGroup = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputDeleteDiscoveryGroup>;
}): Promise<z.output<typeof outputDeleteDiscoveryGroup>> => {
  const group = input.group;
  const reportId = new ObjectId(input.reportId);

  const report = await dbGetDiscovery<Pick<IDiscovery, 'groups'>>(reportId, { groups: 1 });
  if (!report) {
    return {
      success: false,
    };
  }

  const groups = report.groups || [];
  const newGroups = groups.filter((g) => g.name !== group);

  try {
    await dbUpdateDiscovery(reportId, { groups: newGroups });
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return { success: true };
};
