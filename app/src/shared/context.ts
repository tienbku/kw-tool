import * as trpc from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => {
  return { req };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
