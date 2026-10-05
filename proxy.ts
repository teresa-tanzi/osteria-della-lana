import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, verifyToken } from '@/lib/session-token'

// Controllo "ottimistico": respinge subito chi non ha una sessione valida.
// L'autorizzazione vera è ricontrollata in ogni azione e route (lib/session.ts).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login'
  const loggedIn = await verifyToken(request.cookies.get(SESSION_COOKIE_NAME)?.value)

  if (!loggedIn && !isLogin) return NextResponse.redirect(new URL('/admin/login', request.url))
  if (loggedIn && isLogin) return NextResponse.redirect(new URL('/admin', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
