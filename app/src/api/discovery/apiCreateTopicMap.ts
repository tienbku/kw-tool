import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Context } from '../../shared/context';
import { sendToQueue } from '../../shared/queue';
import { IDiscoveryTopicMapMessage } from '../../types/IDiscoveryTopicMapMessage';
import { inputCreateTopicMap, outputCreateTopicMap } from './input/apiCreateTopicMap';
import { dbCreateTopicMap, dbGetTopicMap, dbUpdateTopicMap } from '../../db/topic-map';
import { REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../../types/IReportStatus';

export const apiCreateTopicMap = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputCreateTopicMap>;
}): Promise<z.output<typeof outputCreateTopicMap>> => {
  const { reportId: _reportId } = input;

  if (!_reportId) {
    return {
      success: false,
    };
  }

  let id: string | undefined;
  const reportId = new ObjectId(_reportId);

  const existing = await dbGetTopicMap(reportId);

  if (existing) {
    id = existing._id.toString();
    if (existing.status !== REPORT_STATUS_QUEUED && existing.status !== REPORT_STATUS_PROCESSING) {
      await dbUpdateTopicMap(existing._id, {
        map: [],
        status: REPORT_STATUS_QUEUED,
        hidden: {
          topics: [],
          clusters: [],
          keywords: [],
        },
      });
    }
  } else {
    const created = await dbCreateTopicMap({
      map: [],
      reportId,
      categories: [],
      status: REPORT_STATUS_QUEUED,
      hidden: {
        topics: [],
        clusters: [],
        keywords: [],
      },
    });

    if (created) {
      id = created.toString();
    }
  }

  if (id) {
    await sendToQueue<IDiscoveryTopicMapMessage>('discovery-topic-map', {
      topicMapId: id,
      reportId: _reportId,
      exists: existing !== undefined,
    });
  } else {
    console.error('[discovery-topic-map]: Failed to create topic map');
  }

  return {
    id,
    success: id !== undefined,
  };
};
