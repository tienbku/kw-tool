import { db } from '../shared/db';
import { Filter, ObjectId } from 'mongodb';
import { IDiscoveryItem } from '../types/IDiscoveryItem';

const COLLECTION = 'discoveryItem';

export const dbGetDiscoveryItem = async <T>(
  report: ObjectId,
  keyword: string,
  projection?: { [P in keyof Required<T>]: 1 },
): Promise<T | undefined> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  if (!report || !keyword) {
    return undefined;
  }

  let result;
  const collection = db.collection(COLLECTION);

  if (projection) {
    const finalProjection = { ...projection, _id: 1 };
    result = await collection.findOne<T>({ report, keyword }, { projection: finalProjection });
  } else {
    result = await collection.findOne<T>({ report, keyword });
  }

  return result ? result : undefined;
};

export const dbGetDiscoveryItemsForReport = async <T>(
  report: ObjectId,
  projection?: { [P in keyof Required<T>]: 1 },
  keywords?: string[],
): Promise<T[] | undefined> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  let result;
  const collection = await db.collection(COLLECTION);

  let filter: Filter<Partial<IDiscoveryItem>> = { report };
  if (keywords && keywords.length > 0) {
    filter = { ...filter, keyword: { $in: keywords } };
  }

  if (projection) {
    const finalProjection = { ...projection, _id: 1 };
    result = await collection.find<T & { _id: ObjectId }>(filter, { projection: finalProjection }).toArray();
  } else {
    result = await collection.find<T & { _id: ObjectId }>(filter).toArray();
  }

  if (!result) {
    return undefined;
  }

  return result;
};

export const dbCreateDiscoveryItem = async (item: Omit<IDiscoveryItem, '_id'>): Promise<ObjectId | undefined> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  const collection = await db.collection(COLLECTION);
  const result = await collection.insertOne(item);
  return result.insertedId;
};

export const dbUpdateDiscoveryItem = async (
  reportId: ObjectId,
  keyword: string,
  item: Partial<Omit<IDiscoveryItem, '_id' | 'report' | 'keyword'>>,
): Promise<boolean> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  const collection = await db.collection(COLLECTION);
  const result = await collection.updateOne({ report: reportId, keyword }, { $set: item });
  return result.modifiedCount > 0;
};

export const dbDeleteDiscoveryAllItemsForReport = async (report: ObjectId): Promise<boolean> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  const collection = await db.collection(COLLECTION);
  const result = await collection.deleteMany({ report });
  return result.deletedCount > 0;
};

export const dbDeleteDiscoveryItemsForReport = async (report: ObjectId, keywords?: string[]): Promise<boolean> => {
  if (!db) {
    throw new Error('Database not connected');
  }

  const collection = await db.collection(COLLECTION);
  const result = await collection.deleteMany({ report, keyword: { $in: keywords } });
  return result.deletedCount > 0;
};
