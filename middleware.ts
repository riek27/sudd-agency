import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const paused = process.env.PAUSED === 'true';

  // If paused and the user is not already on /paused, redirect them there
  if (paused && request.nextUrl.pathname !== '/paused') {
    return NextResponse.redirect(new URL('/paused', request.url));
  }

  // If not paused and user tries to visit /paused, redirect to home
  if (!paused && request.nextUrl.pathname === '/paused') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};