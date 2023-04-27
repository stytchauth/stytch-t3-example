import { TRPCError } from '@trpc/server';
import { deleteCookie, setCookie } from 'cookies-next';
import { parsePhoneNumber } from 'react-phone-number-input';
import { StytchError } from 'stytch';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '~/server/trpc';
import { VALID_PHONE_NUMBER } from '~/utils/regex';
import { STYTCH_SUPPORTED_SMS_COUNTRIES } from '~/utils/stytch';

// 30 days
const SESSION_DURATION_MINUTES = 43200;
const SESSION_DURATION_SECONDS = SESSION_DURATION_MINUTES * 60;

export const authRouter = router({
  loginEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email address').min(1, 'Email address is required'),
      }),
    )
    .output(
      z.object({
        methodId: z.string(),
        userCreated: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Login or create the user in Stytch
        const loginOrCreateResponse = await ctx.stytch.otps.email.loginOrCreate({
          email: input.email,
          create_user_as_pending: true,
        });

        // 2. Create the user in your database (and other services)
        if (loginOrCreateResponse.user_created) {
          await ctx.prisma.user.create({ data: { stytchUserId: loginOrCreateResponse.user_id } });
        }

        return {
          methodId: loginOrCreateResponse.email_id,
          userCreated: loginOrCreateResponse.user_created,
        };
      } catch (err) {
        if (err instanceof StytchError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.error_message, cause: err });
        }

        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: err });
      }
    }),

  loginSms: publicProcedure
    .input(
      z.object({
        phone: z.string().regex(VALID_PHONE_NUMBER, 'Invalid phone number').min(1, 'Phone number is required'),
      }),
    )
    .output(
      z.object({
        methodId: z.string(),
        userCreated: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const phoneNumber = parsePhoneNumber(input.phone);

      if (!phoneNumber?.country || !STYTCH_SUPPORTED_SMS_COUNTRIES.includes(phoneNumber.country)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Sorry, we don't support sms login for your country yet.`,
        });
      }

      try {
        // 1. Login or create the user in Stytch
        const loginOrCreateResponse = await ctx.stytch.otps.sms.loginOrCreate({
          phone_number: input.phone,
          create_user_as_pending: true,
        });

        // 2. Create the user in your database (and other services)
        if (loginOrCreateResponse.user_created) {
          await ctx.prisma.user.create({ data: { stytchUserId: loginOrCreateResponse.user_id } });
        }

        return {
          methodId: loginOrCreateResponse.phone_id,
          userCreated: loginOrCreateResponse.user_created,
        };
      } catch (err) {
        if (err instanceof StytchError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.error_message, cause: err });
        }

        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: err });
      }
    }),

  authenticate: publicProcedure
    .input(
      z.object({
        code: z.string().length(6, 'OTP must be 6 digits'),
        methodId: z.string(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 1. Authenticate the user in Stytch by validating the OTP + Method
        const authenticateResponse = await ctx.stytch.otps.authenticate({
          code: input.code,
          method_id: input.methodId,
          session_duration_minutes: SESSION_DURATION_MINUTES,
        });

        // 2. Get the user from your database
        const dbUser = await ctx.prisma.user.findUniqueOrThrow({
          where: { stytchUserId: authenticateResponse.user.user_id },
          select: {
            id: true,
          },
        });

        // 3. Optional: Add custom claims to the session
        // NOTE: think of this more like a "session update" request. Alternatevly
        // this can be done via a custom JWT template in Stytch
        const sessionResponse = await ctx.stytch.sessions.authenticate({
          session_custom_claims: { db_user_id: dbUser.id },
          session_jwt: authenticateResponse.session_jwt,
          session_duration_minutes: SESSION_DURATION_MINUTES,
        });

        setCookie('session_jwt', sessionResponse.session_jwt, {
          req: ctx.req,
          res: ctx.res,
          httpOnly: true,
          maxAge: SESSION_DURATION_SECONDS,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });

        return {
          id: dbUser.id,
        };
      } catch (err) {
        if (err instanceof StytchError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.error_message, cause: err });
        }

        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: err });
      }
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.stytch.sessions.revoke({ session_id: ctx.session.session_id });
    deleteCookie('session_jwt', { req: ctx.req, res: ctx.res });

    return { success: true };
  }),
});
