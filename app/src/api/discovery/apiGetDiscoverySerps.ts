import { Context } from '../../shared/context';
import { z } from 'zod';
import { inputGetDiscoverySerps, outputGetDiscoverySerps } from './input/inputGetDiscoverySerps';
import { dbAddOrUpdateDiscoveryTask, dbGetDiscovery } from '../../db/discovery';
import { IDiscovery } from '../../types/IDiscovery';
import { ObjectId } from 'mongodb';
import { v4 as uuid } from 'uuid';
import { REPORT_STATUS_QUEUED } from '../../types/IReportStatus';
import { sendToQueue } from '../../shared/queue';
import { IDiscoverySerpsMessage } from '../../types/IDiscoverySerpsMessage';

export const apiGetDiscoverySerps = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputGetDiscoverySerps>;
}): Promise<z.output<typeof outputGetDiscoverySerps>> => {
  const reportId = new ObjectId(input.reportId);
  const keywords = input.keywords;

  const report = await dbGetDiscovery<
    Pick<IDiscovery, '_id' | 'seed' | 'easyWinsPatterns' | 'serpLocation' | 'language' | 'location' | 'searchEngine' | 'easyWinsDefaults'>
  >(reportId, {
    _id: 1,
    seed: 1,
    easyWinsDefaults: 1,
    easyWinsPatterns: 1,
    serpLocation: 1,
    language: 1,
    location: 1,
    searchEngine: 1,
  });
  if (!report) {
    return {
      success: false,
    };
  }

  try {
    const taskSerpsUuid = uuid();
    await dbAddOrUpdateDiscoveryTask(reportId, taskSerpsUuid, 'discovery-serps', REPORT_STATUS_QUEUED);
    await sendToQueue<IDiscoverySerpsMessage>('discovery-serps', {
      keywords,
      reportId,
      seed: report.seed,
      taskUuid: taskSerpsUuid,
      language: report.language,
      location: report.location,
      searchEngine: report.searchEngine,
      serpLocation: report.serpLocation,
      easyWinsPatterns: report.easyWinsPatterns,
      easyWinsDefaults: report.easyWinsDefaults,
    });
  } catch (err) {
    console.log(`[getSerpsForKeywords]: Error sending to queue: ${err}`);
    return { success: false };
  }

  return { success: true };
};
