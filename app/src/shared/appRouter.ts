import { createRouter } from './router';
import { discoveryRouter } from '../api/discovery';

export const appRouter = createRouter().merge('discovery:', discoveryRouter);

export type AppRouter = typeof appRouter;
