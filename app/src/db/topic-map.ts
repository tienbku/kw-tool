import { db } from '../shared/db';
import { ObjectId } from 'mongodb';
import { IDiscoveryTopicMap } from '../types/IDiscoveryTopicMap';

const COLLECTION = 'topicMap';

export const dbGetTopicMap = async (reportId: ObjectId): Promise<IDiscoveryTopicMap | undefined> => {
  if (!db) {
    throw new Error('DB not initialized');
  }

  const topicMap = await db.collection(COLLECTION).findOne<IDiscoveryTopicMap>({ reportId });
  if (!topicMap) {
    return undefined;
  }

  return topicMap;
};

export const dbCreateTopicMap = async (topicMap: Omit<IDiscoveryTopicMap, '_id' | 'createdAt' | 'updatedAt'>): Promise<ObjectId | undefined> => {
  if (!db) {
    throw new Error('DB not initialized');
  }

  const result = await db.collection(COLLECTION).insertOne({ ...topicMap, createdAt: new Date() });
  return result.insertedId;
};

export const dbUpdateTopicMap = async (
  id: ObjectId,
  topicMap: Partial<Omit<IDiscoveryTopicMap, '_id' | 'reportId' | 'createdAt' | 'updatedAt'>>,
): Promise<boolean> => {
  if (!db) {
    throw new Error('DB not initialized');
  }

  const result = await db.collection(COLLECTION).updateOne({ _id: id }, { $set: { ...topicMap, updatedAt: new Date() } });
  return result.modifiedCount > 0;
};

export const dbCheckTopicMapExists = async (reportId: ObjectId): Promise<boolean> => {
  if (!db) {
    throw new Error('DB not initialized');
  }

  const result = await db.collection(COLLECTION).findOne({ reportId }, { projection: { _id: 1 } });
  return !!result;
};
