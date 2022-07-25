import { MongoClient, Db } from 'mongodb';

const url: string = process.env.MONGO_URI || '';
const client = new MongoClient(url, {
  maxPoolSize: 10,
  keepAlive: true,
  heartbeatFrequencyMS: 30_000,
});
const dbName = process.env.MONGO_DB || '';
export let db: Db | undefined;

export const connectDb = async () => {
  if (!url) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  db = client.db(dbName);

  return db;
};
