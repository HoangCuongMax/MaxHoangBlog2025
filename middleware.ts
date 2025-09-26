import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Check if this is a blog post with UUID format
  const uuidPattern = /^\/blog\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  
  if (uuidPattern.test(url.pathname)) {
    // Extract UUID from the path
    const uuid = url.pathname.split('/').pop()
    
    // For now, we'll let the page handle the UUID and show a notice
    // In production, you might want to fetch the post title and redirect
    // to the SEO-friendly URL, but that would require database access in middleware
    
    // Add a header to indicate this is a legacy URL
    const response = NextResponse.next()
    response.headers.set('x-legacy-url', 'true')
    return response
  }
  
  return NextResponse.next()
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
}
