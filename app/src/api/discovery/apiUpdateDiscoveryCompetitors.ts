import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Context } from '../../shared/context';
import { IDiscovery } from '../../types/IDiscovery';
import { dbGetDiscovery, dbUpdateDiscovery } from '../../db/discovery';
import { inputUpdateDiscoveryCompetitors, outputUpdateDiscoveryCompetitors } from './input/inputUpdateDiscoveryCompetitors';

export const apiUpdateDiscoveryCompetitors = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputUpdateDiscoveryCompetitors>;
}): Promise<z.output<typeof outputUpdateDiscoveryCompetitors>> => {
  const reportId = new ObjectId(input.reportId);

  if (!reportId) {
    console.error('[apiUpdateDiscoveryCompetitors] Missing reportId or userId');
    return {
      success: false,
    };
  }

  const report = await dbGetDiscovery<Pick<IDiscovery, '_id'>>(reportId, { _id: 1 });
  if (!report) {
    console.error(`[apiUpdateDiscoveryCompetitors] Report not found: ${reportId}`);
    return {
      success: false,
    };
  }

  const { competitors } = input;
  if (competitors === undefined) {
    console.error('[apiUpdateDiscoveryCompetitors] Missing competitors');
    return {
      success: false,
    };
  }

  try {
    await dbUpdateDiscovery(reportId, { competitorPatterns: competitors });
  } catch (err) {
    console.error(err);
    return { success: false };
  }

  return {
    success: true,
  };
};
