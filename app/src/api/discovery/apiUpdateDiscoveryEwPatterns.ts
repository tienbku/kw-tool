import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Context } from '../../shared/context';
import { IDiscovery } from '../../types/IDiscovery';
import { dbGetDiscovery, dbUpdateDiscovery } from '../../db/discovery';
import { inputUpdateDiscoveryEwPatterns, outputUpdateDiscoveryEwPatterns } from './input/inputUpdateDiscoveryEwPatterns';

export const apiUpdateDiscoveryEwPatterns = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputUpdateDiscoveryEwPatterns>;
}): Promise<z.output<typeof outputUpdateDiscoveryEwPatterns>> => {
  const reportId = new ObjectId(input.reportId);

  if (!reportId) {
    console.error('[apiUpdateDiscoveryEwPatterns] Missing reportId or userId');
    return {
      success: false,
    };
  }

  const report = await dbGetDiscovery<Pick<IDiscovery, '_id'>>(reportId, { _id: 1 });
  if (!report) {
    console.error(`[apiUpdateDiscoveryEwPatterns] Report not found: ${reportId}`);
    return {
      success: false,
    };
  }

  const { ewPatterns, ewDefaults } = input;
  if (ewPatterns === undefined || ewDefaults === undefined) {
    console.error('[apiUpdateDiscoveryEwPatterns] Missing competitors');
    return {
      success: false,
    };
  }

  try {
    await dbUpdateDiscovery(reportId, { easyWinsPatterns: ewPatterns, easyWinsDefaults: ewDefaults });
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return {
    success: true,
  };
};
