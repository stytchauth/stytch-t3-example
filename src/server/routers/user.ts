import { deleteCookie } from 'cookies-next';
import { protectedProcedure, publicProcedure, router } from '~/server/trpc';

export const userRouter = router({
  current: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    if (!session) return null;

    const [stytchUser, dbUser] = await Promise.all([
      ctx.stytch.users.get(session.user_id),
      ctx.prisma.user.findUniqueOrThrow({
        where: { id: session.custom_claims.db_user_id },
        select: {
          id: true,
        },
      }),
    ]);

    return {
      id: dbUser.id,
      emails: stytchUser.emails,
      phoneNumbers: stytchUser.phone_numbers,
      status: stytchUser.status,
    };
  }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    const dbUser = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.session.custom_claims.db_user_id,
      },
      select: {
        id: true,
        stytchUserId: true,
      },
    });

    await Promise.all([
      ctx.prisma.user.delete({ where: { id: dbUser.id } }),
      ctx.stytch.users.delete(dbUser.stytchUserId),
    ]);

    deleteCookie('session_jwt', { req: ctx.req, res: ctx.res });

    return { success: true };
  }),
});
