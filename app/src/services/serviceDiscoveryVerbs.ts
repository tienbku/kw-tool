import { Request, Response } from 'express';
import { getDatetime } from '../shared/ymd';
import { ObjectId } from 'mongodb';
import { dbAddOrUpdateDiscoveryTask, dbUpdateDiscovery } from '../db/discovery';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING } from '../types/IReportStatus';
import { dbGetDiscoveryItemsForReport } from '../db/discovery-item';
import { IDiscoveryItem } from '../types/IDiscoveryItem';
import { callPy } from '../shared/py';
import { IDiscoveryVerbsMessage } from '../types/IDiscoveryVerbsMessage';

type Req = Request<Record<string, unknown>, Record<string, unknown>, { message: IDiscoveryVerbsMessage }>;

export const serviceDiscoveryVerbs = async (req: Req, res: Response) => {
  const startTime = Date.now();
  console.log(`[discovery-verbs]: Starting at ${getDatetime(new Date(startTime))}`);

  const data = req.body.message;
  if (!data.reportId) {
    console.error(`[discovery-verbs]: Invalid message received: ${data.toString()}`);
    return res.status(404).json({ message: 'Invalid message' });
  }

  const reportId = new ObjectId(data.reportId);
  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-verbs', REPORT_STATUS_PROCESSING);

  const allKeywords = await dbGetDiscoveryItemsForReport<Pick<IDiscoveryItem, 'keyword'>>(reportId, { keyword: 1 });

  let verbs: string[] | undefined;
  try {
    const pyResponse = await callPy<{ verbs: string[] }, string[]>('verbs.py', {
      keywords: (allKeywords || []).map((item) => item.keyword),
    });
    if (pyResponse && pyResponse.verbs) {
      verbs = pyResponse.verbs;
    }
  } catch (err) {
    console.error(`[discovery-verbs]: Error getting verbs for: ${data.reportId}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-verbs', REPORT_STATUS_ERROR);
    return res.status(500).json({ message: 'Error getting verbs' });
  }

  if (verbs) {
    await dbUpdateDiscovery(reportId, { verbs });
  }

  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-verbs', REPORT_STATUS_COMPLETED);

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`[discovery-verbs]: Finished, took ${minutes} minutes`);

  return res.status(200).json({ success: true });
};
