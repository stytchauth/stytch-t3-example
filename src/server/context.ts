import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { deleteCookie, getCookie } from 'cookies-next';
import { type StytchCustomClaims, type StytchSessionWithCustomClaims } from '~/types/stytch';
import { prisma } from './prisma';
import { loadStytch } from './stytch';

export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  const req = opts?.req;
  const res = opts?.res;

  const stytch = loadStytch();

  let session: StytchSessionWithCustomClaims | undefined = undefined;
  const jwtToken = getCookie('session_jwt', { req, res })?.toString();

  if (jwtToken) {
    try {
      const authenticateJwtResponse = await stytch.sessions.authenticateJwt(jwtToken);
      session = {
        ...authenticateJwtResponse.session,
        custom_claims: authenticateJwtResponse.session.custom_claims as StytchCustomClaims,
      };
    } catch (err) {
      deleteCookie('session_jwt', { req, res });
    }
  }

  return { req, res, prisma, stytch, session };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
