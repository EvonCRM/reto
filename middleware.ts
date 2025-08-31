import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only clear cookies on auth pages to prevent JWT errors from database session era
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    const oldSessionCookies = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.session-token', 
      '__Secure-next-auth.csrf-token',
      '__Host-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ];

    // Check if we have old database session cookies that need clearing
    const hasOldCookies = oldSessionCookies.some(cookieName => 
      request.cookies.get(cookieName)
    );

    if (hasOldCookies) {
      console.log('🧹 Clearing invalid NextAuth cookies from previous sessions');
      oldSessionCookies.forEach(cookieName => {
        response.cookies.delete(cookieName);
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};