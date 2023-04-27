import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { router } from '~/server/trpc';
import { authRouter } from './auth';
import { userRouter } from './user';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
