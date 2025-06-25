import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public paths that are accessible during waitlist period
  const publicPaths = [
    '/', // Landing page
    '/api/waitlist', // Waitlist API
    '/api/waitlist/admin', // Waitlist admin API
    '/admin/waitlist', // Admin waitlist page
    '/favicon.ico', // Favicon
    '/_next', // Next.js assets
    '/assets', // Static assets
    '/hero-bg.png', // Hero background
    '/hero-intro.svg', // Hero intro
  ]

  // Allow access to specific file types and Next.js internals
  const allowedExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
  ]
  const isAssetRequest =
    allowedExtensions.some((ext) => pathname.endsWith(ext)) ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/')

  // Check if the current path is allowed
  const isPublicPath = publicPaths.some((path) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  })

  // Allow access to public paths and assets
  if (isPublicPath || isAssetRequest) {
    return NextResponse.next()
  }

  // For all other routes, redirect to landing page with a message
  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.searchParams.set('waitlist', 'true')

  return NextResponse.redirect(url)
}

// Apply middleware to all routes except API routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/waitlist (waitlist API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/waitlist|_next/static|_next/image|favicon.ico).*)',
  ],
}
