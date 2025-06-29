import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const { pathname } = new URL(request.url)

  const publicPaths = [
    '/',
    '/api/auth/signin',
    '/api/auth/callback',
    '/api/auth/error',
  ]

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url))
  }

  if (token && publicPaths.includes(pathname)) {
    // Redirect to dashboard if authenticated and trying to access public page
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Apply middleware to specific routes
export const config = {
  matcher: ['/', '/dashboard/:path*', '/api/auth/:path*'],
}
