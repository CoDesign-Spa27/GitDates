import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/';

  // Get the token from the cookies
  const token = request.cookies.get('next-auth.session-token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    // If user is authenticated and tries to access public paths, redirect to home
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not authenticated and tries to access protected paths, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
