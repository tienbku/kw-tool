import { v4 as uuid } from 'uuid';
import { Request, Response } from 'express';
import { AsyncFunction, parallelLimit } from 'async';
import { getDatetime } from '../shared/ymd';
import { sendToQueue } from '../shared/queue';
import { DEFAULT_SERP_LOCATION } from '../constants';
import { updateDiscoveryItemSerp, IGetSerpResult } from '../shared/d4s';
import { IDiscoverySerpsMessage } from '../types/IDiscoverySerpsMessage';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../types/IReportStatus';
import { IDiscoverySerpSimilarityMessage } from '../types/IDiscoverySerpSimilarityMessage';
import { dbAddOrUpdateDiscoveryTask } from '../db/discovery';
import { ObjectId } from 'mongodb';
import { dbGetDiscoveryItemsForReport } from '../db/discovery-item';
import { IDiscoveryItem } from '../types/IDiscoveryItem';

type Req = Request<Record<string, unknown>, Record<string, unknown>, { message: IDiscoverySerpsMessage }>;

const MAX_TASK_SIZE = 50;

export const serviceDiscoverySerps = async (req: Req, res: Response) => {
  const startTime = Date.now();
  console.log(`[discovery-serps]: Starting at ${getDatetime(new Date(startTime))}`);

  const data: IDiscoverySerpsMessage = req.body.message;
  if (!data.reportId) {
    console.error(`[discovery-serps]: Invalid message received: ${data.toString()}`);
    return res.status(404).json({ message: 'Invalid message' });
  }

  const reportId = new ObjectId(data.reportId);
  const TAG = `[discovery-serps, ${data.reportId}]`;

  if (!data.keywords || data.keywords.length === 0) {
    console.error(`${TAG}: No keywords set for on report: ${data.reportId}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_ERROR);
    return res.status(404).json({ message: 'No keywords set' });
  }

  if (!data.serpLocation) {
    console.error(`${TAG}: No SERP location set for report: ${data.reportId}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_COMPLETED);
    return res.status(404).json({ message: 'No SERP location set' });
  }

  if (!process.env.D4S_API_USER || !process.env.D4S_API_PASS) {
    console.error(`${TAG}: D4S API credentials not set`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_ERROR);
    return res.status(404).json({ message: 'D4S API credentials not set' });
  }

  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_PROCESSING);

  let countSerpsChecked = 0;
  const missing: string[] = [];
  const allKeywords = await dbGetDiscoveryItemsForReport<
    Pick<IDiscoveryItem, '_id' | 'serpUpdatedAt' | 'keyword' | 'serpFeatures' | 'urlsTop' | 'urlsAll'>
  >(
    reportId,
    {
      _id: 1,
      keyword: 1,
      urlsTop: 1,
      urlsAll: 1,
      serpFeatures: 1,
      serpUpdatedAt: 1,
    },
    data.keywords,
  );

  for (const keyword of data.keywords) {
    const item = allKeywords?.find((item) => item.keyword === keyword);

    // show message every 100 keywords
    countSerpsChecked++;
    if (countSerpsChecked % 100 === 0) {
      console.log(`${TAG}: ${countSerpsChecked}/${data.keywords.length}`);
    }

    if (!item) {
      continue;
    }

    const hasSerpData =
      item.urlsTop &&
      item.urlsTop.length > 0 &&
      item.serpFeatures &&
      item.serpFeatures.length > 0 &&
      item.urlsAll &&
      item.urlsAll.length > 0;

    if (!hasSerpData) {
      console.log(`${TAG}: Keyword SERP ${keyword} not found, will be added`);
      missing.push(keyword);
      continue;
    }

    if (item.serpUpdatedAt) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (item.serpUpdatedAt < oneWeekAgo) {
        console.log(`${TAG}: Keyword SERP for ${keyword} is outdated, will be updated`);
        missing.push(keyword);
      }
    }
  }

  if (missing.length === 0) {
    console.log(`${TAG}: All SERPs found, no need to add`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_COMPLETED);
    return res.status(200).json({ message: 'All SERPs already existed' });
  }

  const tasks: AsyncFunction<IGetSerpResult | undefined>[] = [];

  for (const keyword of missing) {
    tasks.push(async (callback) => {
      try {
        const result = await updateDiscoveryItemSerp(
          reportId,
          keyword,
          data.serpLocation || DEFAULT_SERP_LOCATION,
          data.language,
          data.searchEngine,
          process.env.D4S_API_USER || '',
          process.env.D4S_API_PASS || '',
        );
        callback(undefined, result);
      } catch (err) {
        callback(err as Error, undefined);
      }
    });
  }

  const gathered: string[] = await new Promise((resolve) => {
    parallelLimit(tasks, MAX_TASK_SIZE, (err, results) => {
      if (err && results === undefined) {
        resolve([]);
        return;
      }

      if (results === undefined) {
        resolve([]);
        return;
      }

      const finalResults: string[] = [];
      for (const result of results) {
        if (result !== undefined) {
          finalResults.push(result.keyword);
        }
      }

      resolve(finalResults);
    });
  });

  console.log(`${TAG}: Marking task as completed, got ${gathered.length}/${missing.length} keywords`);
  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-serps', REPORT_STATUS_COMPLETED);

  console.log(`${TAG}: Finished getting SERP & keywords, will update kws`);
  console.log(`${TAG}: Sending new keywords to queue for SERP similarity, then ngrams`);

  const serpSimilarityTaskUuid = uuid();
  await dbAddOrUpdateDiscoveryTask(reportId, serpSimilarityTaskUuid, 'discovery-serps-similarity', REPORT_STATUS_QUEUED);
  await sendToQueue<IDiscoverySerpSimilarityMessage>('discovery-serps-similarity', {
    seed: data.seed,
    reportId: reportId.toString(),
    taskUuid: serpSimilarityTaskUuid,
  });

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`${TAG}: Finished, took ${minutes} minutes`);

  return res.json({ success: true });
};
