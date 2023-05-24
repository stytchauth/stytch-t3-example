import { NextResponse, type NextRequest } from 'next/server';
import { loadStytch } from '~/server/stytch';

export const config = {
  matcher: ['/profile', '/login'],
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Pull the session JWT from the cookie.
  const jwtToken = req.cookies.get('session_jwt')?.value;

  // If there is a JWT, we need to verify it with Stytch to make sure it is valid and take the appropriate action.
  if (jwtToken) {
    // Authenticate the JWT with Stytch; this will tell us if the session is still valid.
    try {
      const stytch = loadStytch();
      await stytch.sessions.authenticateJwt(jwtToken);

      // If the session is valid and they are on the login screen, redirect them to the profile screen.
      if (pathname === '/login') {
        return NextResponse.redirect(new URL('/profile', req.url));
      }
    // If there is an error, the session is invalid, delete the cookie and redirect them to the login screen.
    } catch (err) {
      res.cookies.delete('session_jwt');
      return NextResponse.redirect(new URL('/login', req.url), { headers: res.headers });
    }
  }

  // If there is no token, the user does not have an active session, redirect them to the login screen.
  if (!jwtToken && pathname === '/profile') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
};
