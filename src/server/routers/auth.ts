import { TRPCError } from '@trpc/server';
import { deleteCookie, setCookie } from 'cookies-next';
import { parsePhoneNumber } from 'react-phone-number-input';
import { StytchError } from 'stytch';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '~/server/trpc';
import { VALID_PHONE_NUMBER } from '~/utils/regex';
import { STYTCH_SUPPORTED_SMS_COUNTRIES } from '~/utils/stytch';

// Change these values to adjust the length of a user's session. 30 day sessions, like we use here, is usually a good default,
// but you may find a shorter or longer duration to work better for your app.
const SESSION_DURATION_MINUTES = 43200;

// SESSION_DURATION_SECONDS is used to set the age of the cookie that we set in the user's browser.
const SESSION_DURATION_SECONDS = SESSION_DURATION_MINUTES * 60;

export const authRouter = router({
  // This route is used to send an OTP via email to a user.
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
        // 1. Login or create the user in Stytch. If the user has been seen before, a vanilla login will be performed, if they
        // haven't been seen before, a signup email will be sent and a new Stytch User will be created.
        const loginOrCreateResponse = await ctx.stytch.otps.email.loginOrCreate({
          email: input.email,
          create_user_as_pending: true,
        });

        // 2. Create the user in your Prisma database.
        //
        // Because Stytch auth lives in your backend, you can perform all of your
        // normal business logic in sync with your authentication, e.g. syncing your user DB, adding the user to a mailing list,
        // or provisioning them a Stripe customer, etc.
        //
        // If you're coming from Auth0, you might have Rules, Hooks, or Actions that perform this logic. With Stytch, there is
        // no need for this logic to live outside of your codebase separate from your backend.
        if (loginOrCreateResponse.user_created) {
          await ctx.prisma.user.create({ data: { stytchUserId: loginOrCreateResponse.user_id } });
        }

        return {
          // The method_id is used during the OTP Authenticate step to ensure the OTP code belongs to the user who initiated the
          // the login flow.
          methodId: loginOrCreateResponse.email_id,
          // The user_created flag is used to determine if the user was created during this login flow. This is useful for
          // determining if you should show a welcome message, or take some other action, for new vs. existing users.
          userCreated: loginOrCreateResponse.user_created,
        };
      } catch (err) {
        if (err instanceof StytchError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.error_message, cause: err });
        }

        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: err });
      }
    }),

  // This route is used to send an SMS OTP to a user.
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
        // 1. Login or create the user in Stytch. If the user has been seen before, a vanilla login will be performed, if they
        // haven't been seen before, an SMS will be sent and a new Stytch User will be created.
        const loginOrCreateResponse = await ctx.stytch.otps.sms.loginOrCreate({
          phone_number: input.phone,
          create_user_as_pending: true,
        });

        // 2. Create the user in your Prisma database.
        //
        // Because Stytch auth lives in your backend, you can perform all of your
        // normal business logic in sync with your authentication, e.g. syncing your user DB, adding the user to a mailing list,
        // or provisioning them a Stripe customer, etc.
        //
        // If you're coming from Auth0, you might have Rules, Hooks, or Actions that perform this logic. With Stytch, there is
        // no need for this logic to live outside of your codebase separate from your backend.
        if (loginOrCreateResponse.user_created) {
          await ctx.prisma.user.create({ data: { stytchUserId: loginOrCreateResponse.user_id } });
        }

        return {
          // The method_id is used during the OTP Authenticate step to ensure the OTP code belongs to the user who initiated the
          // the login flow.
          methodId: loginOrCreateResponse.phone_id,
          // The user_created flag is used to determine if the user was created during this login flow. This is useful for
          // determining if you should show a welcome message, or take some other action, for new vs. existing users.
          userCreated: loginOrCreateResponse.user_created,
        };
      } catch (err) {
        if (err instanceof StytchError) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: err.error_message, cause: err });
        }

        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: err });
      }
    }),

  // This route handles authenticating an OTP as input by the user and adding custom claims to their resulting session.
  authenticateOtp: publicProcedure
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
        // 1. OTP Authenticate step; here we'll validate that the OTP + Method (phone_id or email_id) are valid and belong to
        // the same user who initiated the login flow.
        const authenticateResponse = await ctx.stytch.otps.authenticate({
          code: input.code,
          method_id: input.methodId,
          session_duration_minutes: SESSION_DURATION_MINUTES,
        });

        // 2. Get the user from your Prisma database.
        //
        // Here you could also include any other business logic, e.g. firing logs in your own stack, on successful completion of the login flow.
        const dbUser = await ctx.prisma.user.findUniqueOrThrow({
          where: { stytchUserId: authenticateResponse.user.user_id },
          select: {
            id: true,
          },
        });

        // 3. Optional: Add custom claims to the session. These claims will be available in the JWT returned by Stytch.
        // 
        // Alternatively this can also be accomplished via a custom JWT template set in the Stytch Dashboard if there are values you want on 
        // all JWTs issued for your sessions.
        const sessionResponse = await ctx.stytch.sessions.authenticate({
          // Here we add the Prisma user ID to the session as a custom claim.
          session_custom_claims: { db_user_id: dbUser.id },
          session_jwt: authenticateResponse.session_jwt,
          session_duration_minutes: SESSION_DURATION_MINUTES,
        });

        // 4. Set the session JWT as a cookie in the user's browser.
        setCookie('session_jwt', sessionResponse.session_jwt, {
          req: ctx.req,
          res: ctx.res,
          httpOnly: true,
          maxAge: SESSION_DURATION_SECONDS,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
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

  // This route logs a user out of their session by revoking it with Stytch. 
  //
  // Note, because JWTs are valid for their lifetime (here we've set it to 30 days), the JWT would still
  // locally parse, i.e. using an open source JWT parsing library, as valid. We always encourage you to
  // authenticate a session with Stytch's API directly to ensure that it is still valid.
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.stytch.sessions.revoke({ session_id: ctx.session.session_id });
    deleteCookie('session_jwt', { req: ctx.req, res: ctx.res });

    return { success: true };
  }),
});
