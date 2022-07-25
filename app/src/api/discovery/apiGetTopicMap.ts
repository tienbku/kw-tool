import { z } from 'zod';
import { ObjectId } from 'mongodb';
import { Context } from '../../shared/context';
import { dbGetTopicMap } from '../../db/topic-map';
import { getItems } from './apiGetDiscoveryItems';
import { inputGetTopicMap, outputGetTopicMap } from './input/apiGetTopicMap';

export const apiGetTopicMap = async ({
  input,
}: {
  ctx: Context;
  input: z.input<typeof inputGetTopicMap>;
}): Promise<z.output<typeof outputGetTopicMap>> => {
  const { reportId: id } = input;

  if (!id) {
    throw new Error('Invalid user or report id');
  }

  const reportId = new ObjectId(id);
  const topicMap = await dbGetTopicMap(reportId);
  if (!topicMap) {
    throw new Error('Topic map not found');
  }

  const items = await getItems(reportId);

  const output: z.output<typeof outputGetTopicMap> = {
    items,
    map: topicMap.map || [],
    status: topicMap.status,
    hidden: topicMap.hidden,
    id: topicMap._id.toString(),
    reportId: reportId.toString(),
    categories: topicMap.categories,
  };

  try {
    outputGetTopicMap.parse(output);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.issues);
    }
  }

  return output;
};
