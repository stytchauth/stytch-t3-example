import { publicProcedure, router } from '~/server/trpc';

export const userRouter = router({
  // This route fetches the current, logged-in user.
  current: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    if (!session) return null;

    const [stytchUser, dbUser] = await Promise.all([
      ctx.stytch.users.get({user_id: session.user_id}),
      ctx.prisma.user.findUniqueOrThrow({
        where: { id: session.custom_claims.db_user_id },
        select: {
          id: true,
        },
      }),
    ]);

    return {
      id: dbUser.id,
      stytch_user_id: stytchUser.user_id,
      emails: stytchUser.emails,
      phoneNumbers: stytchUser.phone_numbers,
      status: stytchUser.status,
    };
  }),
});
