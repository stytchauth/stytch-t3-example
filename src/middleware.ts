import { NextResponse, type NextRequest } from 'next/server';
import { loadStytch } from '~/server/stytch';

export const config = {
  matcher: ['/dashboard', '/signin'],
};

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const jwtToken = req.cookies.get('session_jwt')?.value;

  if (jwtToken) {
    try {
      const stytch = loadStytch();
      await stytch.sessions.authenticateJwt(jwtToken);

      if (pathname === '/signin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (err) {
      res.cookies.delete('session_jwt');
      return NextResponse.redirect(new URL('/signin', req.url), { headers: res.headers });
    }
  }

  if (!jwtToken && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return res;
};
