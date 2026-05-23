import { NextResponse } from 'next/server'

export function middleware(request) {
  // /admin is completely hidden — no redirect hint, just 404-style block
  // Real auth check is done client-side via Supabase + role
  // The middleware adds an extra layer: block if no auth cookie at all
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const authToken =
      request.cookies.get('sb-ppmkwqoojlmxpfcaxpxx-auth-token') ||
      request.cookies.get('supabase-auth-token')

    if (!authToken) {
      // Redirect to home silently — do NOT reveal /admin exists
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
