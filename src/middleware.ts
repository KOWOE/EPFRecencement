import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET || 'epf-recensement-secret-key-super-secure-2026'
const encodedKey = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session')?.value
  let isValid = false

  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, encodedKey, { algorithms: ['HS256'] })
      isValid = true
    } catch (e) {
      isValid = false
    }
  }

  const isAuthRoute = request.nextUrl.pathname.startsWith('/connexion')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Redirection : si on n'est pas connecté et qu'on essaie d'accéder au dashboard
  if (!isValid && isDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    return NextResponse.redirect(url)
  }

  // Redirection : si on est déjà connecté et qu'on accède à la page de connexion
  if (isValid && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
