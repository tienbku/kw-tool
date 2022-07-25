import { createClient } from 'redis';

export const redisClient = createClient({
  legacyMode: true,
  url: process.env.REDIS_URI || '',
  socket: {
    keepAlive: 1000,
  },
});

export const setupRedis = async () => {
  redisClient.on('error', (err: Error) => {
    console.error(err);
  });

  redisClient.on('end', () => {
    console.log('Redis disconnected');
  });

  redisClient.on('reconnecting', () => {
    console.log('Redis reconnecting');
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  await redisClient.connect().catch(() => {
    throw new Error('Redis connection failed');
  });
};

export const cacheGet = (key: string): Promise<string | undefined> => {
  return redisClient.v4.get(key);
};

export const cacheSet = (key: string, value: string, seconds?: number) => {
  return redisClient.v4.set(key, value, {
    EX: seconds || 60,
  });
};

export const cacheDel = (key: string) => {
  return redisClient.v4.del(key);
};
